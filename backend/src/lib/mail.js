import crypto from 'crypto';
import nodemailer from 'nodemailer';

const ADDRESS = 'Kicukiro Masaka, Kigali, Rwanda';

function config() {
  return {
    host: process.env.SMTP_HOST || 'server126.web-hosting.com',
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER || 'info@creationcarefoundation.org',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'Creation Care Foundation',
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function paragraph(text) {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#173d32;">${text}</p>`;
}

function layout(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;background:#f7f3e8;font-family:Georgia,serif;color:#173d32;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3e8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d7e4dc;border-radius:16px;">
        <tr><td style="padding:28px 28px 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#1d664d;">Creation Care Foundation</td></tr>
        <tr><td style="padding:8px 28px 28px;">${bodyHtml}</td></tr>
        <tr><td style="padding:0 28px 28px;font-size:13px;line-height:1.5;color:#5d6b64;">${escapeHtml(ADDRESS)}<br>info@creationcarefoundation.org</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

let transporter;

function getTransporter() {
  const { host, port, user, pass } = config();
  if (!pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { minVersion: 'TLSv1.2' },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const mailer = getTransporter();
  const { user, fromName } = config();
  if (!mailer || !to) return false;
  const recipient = String(to).trim();
  if (!recipient) return false;
  await mailer.sendMail({
    from: { name: fromName, address: user },
    to: recipient,
    replyTo: replyTo || user,
    subject,
    text: `${text}\n\n${ADDRESS}\ninfo@creationcarefoundation.org`,
    html: layout(html),
    messageId: `<${crypto.randomUUID()}@creationcarefoundation.org>`,
    envelope: { from: user, to: recipient },
    headers: {
      'Auto-Submitted': 'auto-generated',
    },
  });
  return true;
}

export async function sendContactNotices(entry) {
  const { user } = config();
  const name = entry.name || 'Friend';
  const email = entry.email;
  const phone = entry.phone || 'Not given';
  const subject = entry.subject || 'Message from the website';
  const message = entry.message || '';
  const newsletter = subject === 'Newsletter signup';
  const results = [];

  results.push(
    sendMail({
      to: user,
      replyTo: email,
      subject: newsletter ? `Newsletter signup: ${email}` : `New message from ${name}`,
      text: [`From: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Subject: ${subject}`, '', message].join('\n'),
      html: [
        paragraph(newsletter ? 'Someone asked to receive mission updates.' : 'A new message arrived from the website.'),
        paragraph(`<strong>${escapeHtml(name)}</strong><br>${escapeHtml(email)}<br>${escapeHtml(phone)}`),
        paragraph(`<strong>${escapeHtml(subject)}</strong>`),
        paragraph(escapeHtml(message).replace(/\n/g, '<br>')),
      ].join(''),
    }),
  );

  if (email && email.toLowerCase() !== user.toLowerCase()) {
    results.push(
      sendMail({
        to: email,
        replyTo: user,
        subject: newsletter
          ? 'You are on the Creation Care Foundation list'
          : 'We received your message — Creation Care Foundation',
        text: newsletter
          ? `Hello,\n\nThank you for asking to stay close to the mission. We will write occasionally about mentorship, child protection, Care School, and creation care.\n\nIf this was not you, reply to this email and we will remove the address.`
          : `Hello ${name},\n\nThank you for writing to Creation Care Foundation. We have your message and will reply from this address.\n\nSubject: ${subject}\n\n${message}`,
        html: newsletter
          ? [
              paragraph('Hello,'),
              paragraph('Thank you for asking to stay close to the mission. We will write occasionally about mentorship, child protection, Care School, and creation care.'),
              paragraph('If this was not you, reply to this email and we will remove the address.'),
            ].join('')
          : [
              paragraph(`Hello ${escapeHtml(name)},`),
              paragraph('Thank you for writing to Creation Care Foundation. We have your message and will reply from this address.'),
              paragraph(`<strong>${escapeHtml(subject)}</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}`),
            ].join(''),
      }),
    );
  }

  const sent = await Promise.all(results.map((job) => job.catch((error) => {
    console.error('Contact email failed:', error.message);
    return false;
  })));
  const visitorCopy = email && email.toLowerCase() !== user.toLowerCase();
  return Boolean(visitorCopy ? sent[1] : sent[0]);
}

export async function sendDonationNotices(row, kind) {
  const { user } = config();
  const name = row.donor_name || 'Friend';
  const amount = Number(row.amount || 0).toLocaleString('en-RW');
  const reference = row.customer_ref;
  const method = row.method || 'payment';
  const paid = kind === 'paid';
  const jobs = [
    sendMail({
      to: user,
      replyTo: row.email,
      subject: paid ? `Gift received: ${amount} RWF from ${name}` : `Gift not completed: ${name}`,
      text: [`Donor: ${name}`, `Email: ${row.email}`, `Phone: ${row.phone}`, `Amount: ${amount} RWF`, `Method: ${method}`, `Reference: ${reference}`, `Status: ${paid ? 'Received' : 'Not completed'}`].join('\n'),
      html: [
        paragraph(paid ? 'A live gift was received.' : 'A gift was started but was not completed.'),
        paragraph(`<strong>${escapeHtml(name)}</strong><br>${escapeHtml(row.email)}<br>${escapeHtml(row.phone || '')}`),
        paragraph(`${escapeHtml(amount)} RWF · ${escapeHtml(method)}<br>Reference ${escapeHtml(reference)}`),
      ].join(''),
    }),
  ];
  if (row.email) {
    jobs.push(
      sendMail({
        to: row.email,
        replyTo: user,
        subject: paid
          ? 'Your gift was received — Creation Care Foundation'
          : 'Your gift was not completed — Creation Care Foundation',
        text: paid
          ? `Hello ${name},\n\nThank you. Creation Care Foundation received your gift of ${amount} RWF.\nReference: ${reference}\n\nThis note is your receipt.`
          : `Hello ${name},\n\nYour gift of ${amount} RWF was not completed, so no money was taken.\nReference: ${reference}\n\nYou can try again on the donate page whenever you are ready.`,
        html: paid
          ? [
              paragraph(`Hello ${escapeHtml(name)},`),
              paragraph(`Thank you. Creation Care Foundation received your gift of <strong>${escapeHtml(amount)} RWF</strong>.`),
              paragraph(`Reference ${escapeHtml(reference)}. Please keep this note as your receipt.`),
            ].join('')
          : [
              paragraph(`Hello ${escapeHtml(name)},`),
              paragraph(`Your gift of ${escapeHtml(amount)} RWF was not completed, so no money was taken.`),
              paragraph(`Reference ${escapeHtml(reference)}. You can try again on the donate page whenever you are ready.`),
            ].join(''),
      }),
    );
  }
  await Promise.all(jobs.map((job) => job.catch((error) => {
    console.error('Donation email failed:', error.message);
    return false;
  })));
}

export async function sendPayoutNotice(row, kind) {
  const { user } = config();
  const amount = Number(row.amount || 0).toLocaleString('en-RW');
  const completed = kind === 'completed';
  const failed = kind === 'failed';
  const subject = completed
    ? `Payout completed: ${amount} RWF`
    : failed
      ? `Payout failed: ${amount} RWF`
      : `Payout waiting for confirmation: ${amount} RWF`;
  const text = completed
    ? `The payout of ${amount} RWF to ${row.recipient_name} (${row.msisdn}) is complete.\nReference: ${row.customer_ref}`
    : failed
      ? `The payout of ${amount} RWF to ${row.recipient_name} was not completed.\nReference: ${row.customer_ref}`
      : `A payout of ${amount} RWF to ${row.recipient_name} (${row.msisdn}) is waiting. Confirm the code sent to this mailbox before the money is sent.\nReference: ${row.customer_ref}`;
  await sendMail({
    to: user,
    subject,
    text,
    html: paragraph(escapeHtml(text).replace(/\n/g, '<br>')),
  }).catch((error) => {
    console.error('Payout email failed:', error.message);
  });
}
