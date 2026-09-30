import crypto from 'crypto';

export const PROVIDERS = [
  { id: '63510', name: 'MTN Mobile Money' },
  { id: '63514', name: 'Airtel Rwanda' },
  { id: '63509', name: 'SPENN' },
  { id: '040', name: 'Banque de Kigali' },
  { id: '400', name: 'Banque Populaire du Rwanda' },
  { id: '192', name: 'Equity Bank' },
  { id: '100', name: 'Ecobank Rwanda' },
  { id: '115', name: 'Access Bank Rwanda' },
];

const LIVE_SITE_ORIGIN = 'https://creationcarefoundation.org';

export function xentriConfig() {
  const baseUrl = (process.env.XENTRIPAY_BASE_URL || 'https://xentripay.com').replace(/\/$/, '');
  const apiKey = process.env.XENTRIPAY_API_KEY || '';
  const webhookSecret = process.env.XENTRIPAY_WEBHOOK_SECRET || '';
  const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
  const live = !baseUrl.includes('merchant.test.');
  return { baseUrl, apiKey, webhookSecret, siteUrl, live };
}

export function publicReturnOrigin() {
  const { siteUrl } = xentriConfig();
  try {
    const url = new URL(siteUrl);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (url.protocol === 'https:' && !local) return url.origin;
  } catch {
    /* use the live site */
  }
  return LIVE_SITE_ORIGIN;
}

export function cardReturnUrl() {
  return `${publicReturnOrigin()}/donate`;
}

export function assertConfigured() {
  const { apiKey, baseUrl } = xentriConfig();
  if (!apiKey) {
    const error = new Error('Live XentriPay API key is missing. Set XENTRIPAY_API_KEY in backend/.env.');
    error.status = 503;
    throw error;
  }
  if (baseUrl.includes('merchant.test.')) {
    const error = new Error('XENTRIPAY_BASE_URL is the test host. Use https://xentripay.com for live payments.');
    error.status = 400;
    throw error;
  }
}

export function normalizeRwandaPhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  let local = digits;
  if (local.startsWith('250') && local.length >= 12) local = `0${local.slice(3)}`;
  if (local.length === 9) local = `0${local}`;
  if (!/^0\d{9}$/.test(local)) {
    const error = new Error('Phone must be a Rwanda number, for example 0788123456.');
    error.status = 400;
    throw error;
  }
  return { cnumber: local, msisdn: `250${local.slice(1)}`, payoutMsisdn: local };
}

async function readGateway(response) {
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text.slice(0, 300) };
  }
  return data;
}

function gatewayMessage(data, status) {
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data.reply === 'string' && data.reply.trim()) return data.reply.trim();
  if (typeof data.error === 'string' && data.error.trim()) return data.error.trim();
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((item) => item?.message || item).filter(Boolean).join(' ');
  }
  return `XentriPay request failed (${status})`;
}

export async function xentriRequest(path, { method = 'GET', body } = {}) {
  assertConfigured();
  const { baseUrl, apiKey } = xentriConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'X-XENTRIPAY-KEY': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await readGateway(response);
  const retcode = data.retcode == null ? 0 : Number(data.retcode);
  if (!response.ok || data.success === 0 || (data.retcode != null && retcode !== 0)) {
    const emptyRefusal = response.status === 401 && !data.message && Object.keys(data).length === 0;
    const invalidKey = response.status === 401 && !emptyRefusal;
    const error = new Error(
      emptyRefusal
        ? 'XentriPay did not accept the payment call from this computer.'
        : invalidKey
          ? data.message || 'XentriPay rejected the API key. It is invalid or disabled. In the merchant dashboard, open Settings, then API keys, confirm Enabled is Yes, and copy the key again.'
          : gatewayMessage(data, response.status),
    );
    error.status = response.status === 401 ? 502 : response.status >= 400 ? response.status : 502;
    error.code = emptyRefusal ? 'GATEWAY_BLOCKED' : undefined;
    error.payload = data;
    throw error;
  }
  return data;
}

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret || !signature || !rawBody) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  const received = Buffer.from(String(signature));
  const computed = Buffer.from(expected);
  if (received.length !== computed.length) return false;
  return crypto.timingSafeEqual(received, computed);
}

export async function initiateCardCheckout({ email, name, phone, amount, customerRef, focus }) {
  const returnUrl = cardReturnUrl();
  const payment = await xentriRequest('/api/collections/initiate', {
    method: 'POST',
    body: {
      email,
      cname: name,
      cnumber: phone.cnumber,
      amount,
      msisdn: phone.msisdn,
      currency: 'RWF',
      pmethod: 'cc',
      redirecturl: returnUrl,
      returl: returnUrl,
      chargesIncluded: true,
      customerRef,
      details: `Creation Care Foundation gift (${focus})`,
    },
  });
  const gatewayUrl = payment.url || payment.gatewayUrl || null;
  if (!gatewayUrl) {
    const error = new Error(payment.reply || 'The live card page did not return a payment link. Try again.');
    error.status = 502;
    throw error;
  }
  return {
    url: gatewayUrl,
    refid: payment.refid || payment.rid || null,
    tid: payment.tid || null,
  };
}

export function isPaidStatus(status) {
  return ['SUCCESS', 'SUCCESSFUL', 'COMPLETED'].includes(String(status || '').toUpperCase());
}

export function isFailedStatus(status) {
  return ['FAILED', 'REVERSED', 'DECLINED', 'CANCELLED'].includes(String(status || '').toUpperCase());
}
