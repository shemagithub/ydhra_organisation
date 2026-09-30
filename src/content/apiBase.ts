export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN ?? '').replace(/\/$/, '');
export const API_BASE = `${API_ORIGIN}/api`;

export function rewriteUploads<T>(value: T): T {
  if (!API_ORIGIN) return value;
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) return `${API_ORIGIN}${value}` as T;
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => rewriteUploads(item)) as T;
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      next[key] = rewriteUploads(item);
    }
    return next as T;
  }
  return value;
}

export function restoreUploads<T>(value: T): T {
  if (!API_ORIGIN) return value;
  const prefix = `${API_ORIGIN}/uploads/`;
  if (typeof value === 'string') {
    if (value.startsWith(prefix)) return value.slice(API_ORIGIN.length) as T;
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => restoreUploads(item)) as T;
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      next[key] = restoreUploads(item);
    }
    return next as T;
  }
  return value;
}
