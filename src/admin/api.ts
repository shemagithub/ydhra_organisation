import { API_BASE, restoreUploads } from '@/content/apiBase';
import type { BlogPost, SiteContent, SocialLink } from '@/content/types';

const API = API_BASE;

async function parseJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  return data as Record<string, unknown>;
}

export async function adminMe() {
  const response = await fetch(`${API}/auth/me`, { credentials: 'include', cache: 'no-store' });
  const data = await parseJson(response);
  return {
    ok: response.ok,
    authenticated: Boolean(data.authenticated),
    admin: (data.admin as { id: number; email: string; name: string } | undefined) ?? null,
  };
}

export async function adminLogin(password: string, email?: string) {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email }),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    error: typeof data.error === 'string' ? data.error : null,
    admin: (data.admin as { id: number; email: string; name: string } | undefined) ?? null,
  };
}

export async function adminLogout() {
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function fetchPublicContent() {
  const response = await fetch(`${API}/content`, { credentials: 'include', cache: 'no-store' });
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Failed to load content');
  }
  return data.content as SiteContent;
}

export async function adminSaveContent(content: SiteContent) {
  const response = await fetch(`${API}/content`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: restoreUploads(content) }),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    error: typeof data.error === 'string' ? data.error : response.ok ? null : 'Save failed',
    content: (data.content as SiteContent | undefined) ?? null,
  };
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API}/dashboard/stats`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await parseJson(response);
  return {
    ok: response.ok,
    stats: (data.stats as Record<string, unknown> | undefined) ?? null,
  };
}

export async function fetchMessages(status = 'all', q = '') {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (q) params.set('q', q);
  const response = await fetch(`${API}/messages?${params}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await parseJson(response);
  return {
    ok: response.ok,
    messages: (data.messages as Array<Record<string, unknown>>) ?? [],
  };
}

export async function updateMessageStatus(id: number, status: string) {
  const response = await fetch(`${API}/messages/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return response.ok;
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const response = await fetch(`${API}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    emailSent: Boolean(data.emailSent),
    error: typeof data.error === 'string' ? data.error : null,
  };
}

export async function uploadAdminImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${API}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    url: typeof (data.asset as { url?: string } | undefined)?.url === 'string'
      ? (data.asset as { url: string }).url
      : null,
    error: typeof data.error === 'string' ? data.error : null,
  };
}

export async function startLiveDonation(payload: {
  name: string;
  email: string;
  phone: string;
  amount: number;
  method: 'momo' | 'airtel' | 'card';
  focus: string;
}) {
  const response = await fetch(`${API}/payments/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    error: typeof data.error === 'string' ? data.error : response.ok ? null : 'Payment could not start',
    gatewayUrl: typeof data.gatewayUrl === 'string' ? data.gatewayUrl : null,
    customerRef: typeof data.customerRef === 'string' ? data.customerRef : null,
    message: typeof data.message === 'string' ? data.message : null,
  };
}

export async function fetchDonationStatus(customerRef: string) {
  const response = await fetch(`${API}/payments/collections/${encodeURIComponent(customerRef)}`, {
    cache: 'no-store',
  });
  const data = await parseJson(response);
  const payment = (data.payment as { status?: string; paid?: boolean; failed?: boolean; amount?: number } | undefined) ?? null;
  return { ok: response.ok, payment };
}

export async function fetchWallet() {
  const response = await fetch(`${API}/payments/wallet`, { credentials: 'include', cache: 'no-store' });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    error: typeof data.error === 'string' ? data.error : null,
    wallet: data,
  };
}

export async function createPayout(payload: {
  providerId: string;
  name: string;
  phone: string;
  amount: number;
}) {
  const response = await fetch(`${API}/payments/payouts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return {
    ok: response.ok && Boolean(data.ok),
    error: typeof data.error === 'string' ? data.error : null,
    message: typeof data.message === 'string' ? data.message : null,
  };
}

export async function refreshPayout(customerRef: string) {
  const response = await fetch(`${API}/payments/payouts/${encodeURIComponent(customerRef)}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await parseJson(response);
  return { ok: response.ok && Boolean(data.ok), error: typeof data.error === 'string' ? data.error : null };
}

export type { BlogPost, SocialLink };
