import crypto from 'crypto';
import { Router } from 'express';
import { query } from '../lib/db.js';
import { sendDonationNotices, sendPayoutNotice } from '../lib/mail.js';
import { requireAuth } from '../middleware/auth.js';
import {
  PROVIDERS,
  isFailedStatus,
  isPaidStatus,
  normalizeRwandaPhone,
  verifyWebhookSignature,
  xentriConfig,
  xentriRequest,
} from '../lib/xentripay.js';

const router = Router();

function newRef(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function ledger() {
  const collectedRows = await query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM payment_collections
     WHERE status IN ('SUCCESS', 'SUCCESSFUL', 'COMPLETED')`,
  );
  const reservedRows = await query(
    `SELECT COALESCE(SUM(amount + COALESCE(txn_charge, 0)), 0) AS total
     FROM payment_payouts
     WHERE status IN ('PENDING', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED')`,
  );
  const collected = Number(collectedRows[0]?.total || 0);
  const reserved = Number(reservedRows[0]?.total || 0);
  return {
    currency: 'RWF',
    collected,
    reserved,
    available: Math.max(0, collected - reserved),
  };
}

async function refreshCollection(row) {
  if (!row || isPaidStatus(row.status) || isFailedStatus(row.status)) return row;
  try {
    const remote = await xentriRequest(`/api/collections/status/${encodeURIComponent(row.customer_ref)}`);
    const status = String(remote.status || row.status).toUpperCase();
    await query('UPDATE payment_collections SET status = ?, refid = COALESCE(?, refid) WHERE id = ?', [
      status,
      remote.rid || remote.refid || null,
      row.id,
    ]);
    const updated = { ...row, status, refid: remote.rid || remote.refid || row.refid };
    await maybeNotifyCollection(updated);
    return updated;
  } catch {
    return row;
  }
}

async function claimNotice(table, id, kind, current) {
  if (!id || current === kind) return false;
  const result = await query(
    `UPDATE ${table} SET notice_sent = ? WHERE id = ? AND (notice_sent IS NULL OR notice_sent <> ?)`,
    [kind, id, kind],
  );
  return Boolean(result.affectedRows);
}

async function maybeNotifyCollection(row) {
  if (!row?.id) return;
  const paid = isPaidStatus(row.status);
  const failed = isFailedStatus(row.status);
  if (!paid && !failed) return;
  const kind = paid ? 'paid' : 'failed';
  if (!(await claimNotice('payment_collections', row.id, kind, row.notice_sent))) return;
  try {
    await sendDonationNotices(row, kind);
  } catch (error) {
    console.error('Donation email failed:', error.message);
    await query('UPDATE payment_collections SET notice_sent = NULL WHERE id = ?', [row.id]);
  }
}

async function maybeNotifyPayout(row) {
  if (!row?.id) return;
  const status = String(row.status || '').toUpperCase();
  const kind = ['SUCCESS', 'SUCCESSFUL', 'COMPLETED'].includes(status)
    ? 'completed'
    : ['FAILED', 'REVERSED'].includes(status)
      ? 'failed'
      : 'submitted';
  if (!(await claimNotice('payment_payouts', row.id, kind, row.notice_sent))) return;
  try {
    await sendPayoutNotice(row, kind);
  } catch (error) {
    console.error('Payout email failed:', error.message);
    await query('UPDATE payment_payouts SET notice_sent = NULL WHERE id = ?', [row.id]);
  }
}

router.post('/collections', async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const method = String(req.body?.method || 'momo');
    const focus = String(req.body?.focus || 'where-needed').slice(0, 80);
    const amount = Math.round(Number(req.body?.amount));
    if (!name || !email) return res.status(400).json({ ok: false, error: 'Name and email are required.' });
    if (!['momo', 'airtel', 'card'].includes(method)) {
      return res.status(400).json({ ok: false, error: 'Choose MTN MoMo, Airtel Money, or card.' });
    }
    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ ok: false, error: 'Live gifts must be at least 100 RWF, with no decimals.' });
    }

    const phone = normalizeRwandaPhone(req.body?.phone);
    const customerRef = newRef('CCF');
    const { siteUrl } = xentriConfig();
    const returnUrl = `${siteUrl}/donate?ref=${encodeURIComponent(customerRef)}`;
    const pmethod = method === 'card' ? 'cc' : 'momo';
    const payload = {
      email,
      cname: name,
      amount,
      cnumber: phone.cnumber,
      msisdn: phone.msisdn,
      currency: 'RWF',
      pmethod,
      chargesIncluded: true,
      customerRef,
      details: `Creation Care Foundation gift · ${focus}`,
    };
    if (pmethod === 'cc') {
      payload.redirecturl = returnUrl;
      payload.returl = returnUrl;
    }

    const gateway = await xentriRequest('/api/collections/initiate', { method: 'POST', body: payload });
    await query(
      `INSERT INTO payment_collections
        (customer_ref, refid, tid, donor_name, email, phone, amount, method, focus, status, gateway_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [
        customerRef,
        gateway.refid || null,
        gateway.tid || null,
        name,
        email,
        phone.cnumber,
        amount,
        method,
        focus,
        gateway.url || null,
      ],
    );

    return res.status(201).json({
      ok: true,
      environment: 'production',
      customerRef,
      refid: gateway.refid || null,
      status: 'PENDING',
      amount,
      currency: 'RWF',
      method,
      gatewayUrl: gateway.url || null,
      message:
        pmethod === 'cc'
          ? 'Continue to the secure card page to finish your gift.'
          : 'Approve the Mobile Money prompt on your phone to complete this gift.',
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/collections/:customerRef', async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM payment_collections WHERE customer_ref = ? LIMIT 1', [
      req.params.customerRef,
    ]);
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Payment not found.' });
    const row = await refreshCollection(rows[0]);
    return res.json({
      ok: true,
      payment: {
        customerRef: row.customer_ref,
        status: row.status,
        amount: row.amount,
        currency: row.currency,
        method: row.method,
        paid: isPaidStatus(row.status),
        failed: isFailedStatus(row.status),
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/wallet', requireAuth, async (_req, res, next) => {
  try {
    const balance = await ledger();
    const collections = await query(
      `SELECT customer_ref AS customerRef, donor_name AS donorName, email, amount, currency, method, status, created_at AS createdAt
       FROM payment_collections ORDER BY id DESC LIMIT 30`,
    );
    const payouts = await query(
      `SELECT customer_ref AS customerRef, provider_name AS providerName, msisdn, recipient_name AS recipientName,
              amount, txn_charge AS txnCharge, currency, status, status_message AS statusMessage, created_at AS createdAt
       FROM payment_payouts ORDER BY id DESC LIMIT 30`,
    );
    const { live, baseUrl } = xentriConfig();
    return res.json({
      ok: true,
      environment: live ? 'production' : 'test',
      gateway: baseUrl,
      configured: Boolean(process.env.XENTRIPAY_API_KEY),
      balance,
      providers: PROVIDERS,
      collections,
      payouts,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/payouts', requireAuth, async (req, res, next) => {
  try {
    const provider = PROVIDERS.find((item) => item.id === String(req.body?.providerId || ''));
    if (!provider) return res.status(400).json({ ok: false, error: 'Choose a payout provider.' });
    const recipientName = String(req.body?.name || '').trim();
    const amount = Math.round(Number(req.body?.amount));
    if (!recipientName) return res.status(400).json({ ok: false, error: 'Recipient name is required.' });
    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ ok: false, error: 'Payout amount must be at least 100 RWF.' });
    }
    const phone = normalizeRwandaPhone(req.body?.phone);
    const balance = await ledger();
    if (amount > balance.available) {
      return res.status(400).json({
        ok: false,
        error: `Available balance is ${balance.available} RWF. Reduce the payout amount.`,
      });
    }

    const customerReference = newRef('PAY');
    const gateway = await xentriRequest('/api/payment-requests', {
      method: 'POST',
      body: {
        customerReference,
        telecomProviderId: provider.id,
        msisdn: phone.payoutMsisdn,
        name: recipientName,
        transactionType: 'PAYOUT',
        currency: 'RWF',
        amount,
      },
    });

    const payoutStatus = String(gateway.status || 'PENDING').toUpperCase();
    const inserted = await query(
      `INSERT INTO payment_payouts
        (customer_ref, provider_id, provider_name, msisdn, recipient_name, amount, currency, status, status_message, internal_ref, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 'RWF', ?, ?, ?, ?)`,
      [
        customerReference,
        provider.id,
        provider.name,
        phone.payoutMsisdn,
        recipientName,
        amount,
        payoutStatus,
        gateway.statusMessage || 'Payout submitted. Confirm the OTP sent to the registered business contact.',
        gateway.internalRef || null,
        req.admin.id,
      ],
    );
    await maybeNotifyPayout({
      id: inserted.insertId,
      customer_ref: customerReference,
      recipient_name: recipientName,
      msisdn: phone.payoutMsisdn,
      amount,
      status: payoutStatus,
      notice_sent: null,
    });

    return res.status(201).json({
      ok: true,
      environment: 'production',
      customerRef: customerReference,
      status: gateway.status || 'PENDING',
      message:
        'Payout submitted on the live gateway. Confirm the OTP sent to the registered XentriPay business email or phone before the money is sent.',
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/payouts/:customerRef/refresh', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM payment_payouts WHERE customer_ref = ? LIMIT 1', [
      req.params.customerRef,
    ]);
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Payout not found.' });
    const remote = await xentriRequest(
      `/api/payment-requests/check-status?customerRef=${encodeURIComponent(req.params.customerRef)}`,
    );
    const status = String(remote.status || remote?.data?.status || rows[0].status).toUpperCase();
    await query(
      'UPDATE payment_payouts SET status = ?, status_message = ?, txn_charge = COALESCE(?, txn_charge), internal_ref = COALESCE(?, internal_ref) WHERE id = ?',
      [
        status,
        remote.statusMessage || null,
        remote.txnCharge ?? null,
        remote.internalRef || null,
        rows[0].id,
      ],
    );
    await maybeNotifyPayout({ ...rows[0], status });
    return res.json({ ok: true, status, message: remote.statusMessage || null });
  } catch (error) {
    return next(error);
  }
});

export async function handleXentriWebhook(req, res) {
  const { webhookSecret } = xentriConfig();
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
  const signature = req.headers['x-xentripay-signature'];
  if (!webhookSecret || !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    return res.status(401).json({ ok: false, error: 'Invalid webhook signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const idempotencyKey = String(
    payload.idempotencyKey || req.headers['x-xentripay-idempotency-key'] || '',
  );
  if (idempotencyKey) {
    const existing = await query('SELECT id FROM webhook_events WHERE idempotency_key = ? LIMIT 1', [
      idempotencyKey,
    ]);
    if (existing[0]) return res.status(200).json({ received: true, duplicate: true });
    await query('INSERT INTO webhook_events (idempotency_key, event_type, payload) VALUES (?, ?, CAST(? AS JSON))', [
      idempotencyKey,
      String(payload.event || 'UNKNOWN'),
      JSON.stringify(payload),
    ]);
  }

  const event = String(payload.event || '').toUpperCase();
  const data = payload.data || {};
  const reference = data.customerRef || data.customerReference || data.reference || data.refid || data.rid;
  const status = String(data.status || '').toUpperCase();

  if (reference && event.startsWith('COLLECTION')) {
    const next = event.includes('SUCCESS') ? 'SUCCESS' : event.includes('FAIL') ? 'FAILED' : status || 'PENDING';
    await query('UPDATE payment_collections SET status = ? WHERE customer_ref = ? OR refid = ?', [
      next,
      reference,
      reference,
    ]);
    const collections = await query(
      'SELECT * FROM payment_collections WHERE customer_ref = ? OR refid = ? LIMIT 1',
      [reference, reference],
    );
    await maybeNotifyCollection(collections[0]);
  }

  if (reference && (event.startsWith('PAYOUT') || event.includes('PAYMENTREQUEST') || event.includes('SINGLEPAYOUT'))) {
    const next = event.includes('SUCCESS') || event.includes('COMPLETED') || status === 'SUCCESSFUL' || status === 'COMPLETED'
      ? 'SUCCESSFUL'
      : event.includes('FAIL')
        ? 'FAILED'
        : event.includes('REVERS')
          ? 'REVERSED'
          : 'PENDING';
    await query(
      'UPDATE payment_payouts SET status = ?, status_message = COALESCE(?, status_message) WHERE customer_ref = ?',
      [next, data.statusMessage || event, reference],
    );
    const payouts = await query('SELECT * FROM payment_payouts WHERE customer_ref = ? LIMIT 1', [reference]);
    if (payouts[0]) await maybeNotifyPayout({ ...payouts[0], status: next });
  }

  return res.status(200).json({ received: true });
}

export default router;
