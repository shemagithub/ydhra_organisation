import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STATIC_PATHS = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
  { path: '/programs', priority: '0.8' },
  { path: '/programs/care-school', priority: '0.8' },
  { path: '/blog', priority: '0.8' },
  { path: '/gallery', priority: '0.7' },
  { path: '/team', priority: '0.6' },
  { path: '/get-involved', priority: '0.7' },
  { path: '/donate', priority: '0.7' },
  { path: '/contact', priority: '0.7' },
];

export function siteOrigin() {
  const raw = (process.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (!raw || /localhost|127\.0\.0\.1/.test(raw)) return 'https://creationcarefoundation.org';
  return raw;
}

export function buildSitemap(blogPosts = []) {
  const origin = siteOrigin();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PATHS.map((item) => ({
      loc: item.path === '/' ? `${origin}/` : `${origin}${item.path}`,
      priority: item.priority,
    })),
    ...blogPosts
      .filter((post) => post?.slug)
      .map((post) => ({
        loc: `${origin}/blog/${post.slug}`,
        priority: '0.7',
      })),
  ];
  const body = urls
    .map(
      (url) =>
        `  <url><loc>${url.loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${url.priority}</priority></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function writePublicSitemap(blogPosts = []) {
  const target = path.resolve(__dirname, '../../../public/sitemap.xml');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buildSitemap(blogPosts), 'utf8');
}
