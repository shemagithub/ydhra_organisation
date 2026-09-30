export type ResolvedVideo =
  | { kind: 'embed'; src: string; title: string }
  | { kind: 'file'; src: string }
  | { kind: 'link'; href: string }
  | { kind: 'empty' }
  | { kind: 'invalid' };

function pastedAddress(input: string) {
  const trimmed = input.trim();
  const embedded = trimmed.match(/src=["']([^"']+)["']/i);
  return (embedded?.[1] ?? trimmed).trim();
}

function youtubeId(value: string) {
  return /^[\w-]{11}$/.test(value) ? value : '';
}

export function resolveVideoLink(input: string): ResolvedVideo {
  const raw = pastedAddress(input);
  if (!raw) return { kind: 'empty' };

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { kind: 'invalid' };
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { kind: 'invalid' };

  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  if (host === 'youtu.be') {
    const id = youtubeId(url.pathname.split('/').filter(Boolean)[0] ?? '');
    if (id) {
      return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}`, title: 'YouTube video' };
    }
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const fromPath = parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live' ? parts[1] : '';
    const id = youtubeId(url.searchParams.get('v') || fromPath || '');
    if (id) {
      return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}`, title: 'YouTube video' };
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.split('/').filter((part) => /^\d+$/.test(part)).at(-1);
    if (id) {
      return { kind: 'embed', src: `https://player.vimeo.com/video/${id}`, title: 'Vimeo video' };
    }
  }

  if (url.protocol === 'https:' && /\.(mp4|webm|ogg)(?:$)/i.test(url.pathname)) {
    return { kind: 'file', src: url.toString() };
  }

  if (url.protocol === 'https:' || url.protocol === 'http:') {
    return { kind: 'link', href: url.toString() };
  }

  return { kind: 'invalid' };
}
