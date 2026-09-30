type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  robots?: string;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function absoluteUrl(path: string) {
  const origin = window.location.origin;
  if (!path || path === '/') return `${origin}/`;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function applySeo({ title, description, path, image, type = 'website', jsonLd, robots = 'index, follow' }: SeoInput) {
  const url = absoluteUrl(path);
  const imageUrl = image ? (image.startsWith('http') ? image : absoluteUrl(image)) : absoluteUrl('/hero-africa.jpg');

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', robots);
  upsertLink('canonical', url);

  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', imageUrl);
  upsertMeta('property', 'og:site_name', 'Creation Care Foundation');
  upsertMeta('property', 'og:locale', 'en_RW');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', imageUrl);

  const existing = document.getElementById('ccf-jsonld');
  existing?.remove();
  if (jsonLd) {
    const script = document.createElement('script');
    script.id = 'ccf-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

export function organizationJsonLd(contact: { email: string; phonePrimary: string; address: string }) {
  const origin = window.location.origin;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        name: 'Creation Care Foundation',
        url: `${origin}/`,
        email: contact.email,
        telephone: contact.phonePrimary,
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address,
          addressLocality: 'Kigali',
          addressCountry: 'RW',
        },
        areaServed: 'Rwanda',
        description:
          'A Christian organization in Kigali mentoring children and youth, providing nursery and primary education, protecting children, and caring for creation.',
      },
      {
        '@type': 'WebSite',
        name: 'Creation Care Foundation',
        url: `${origin}/`,
      },
    ],
  };
}

export function articleJsonLd(post: { title: string; excerpt: string; date: string; cover: { src: string }; slug: string }) {
  const origin = window.location.origin;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover.src.startsWith('http') ? post.cover.src : `${origin}${post.cover.src}`,
    mainEntityOfPage: `${origin}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'Creation Care Foundation' },
    publisher: { '@type': 'Organization', name: 'Creation Care Foundation' },
  };
}
