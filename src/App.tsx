import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Globe2,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MoveRight,
  Phone,
  Play,
  Scale,
  Shield,
  Smartphone,
  CreditCard,
  Facebook,
  Instagram,
  Youtube,
  Users,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useRoute } from 'wouter';
import creationCareLogo from '@/assets/creation-care-logo.png';
import creationCareLogoLight from '@/assets/creation-care-logo-light.png';
import NotFound from '@/pages/not-found';
import { applySeo, articleJsonLd, organizationJsonLd } from '@/content/seo';

const AdminApp = lazy(() => import('@/admin/AdminApp'));
import { fetchDonationStatus, startLiveDonation, submitContactMessage } from '@/admin/api';
import { ContentProvider, useSiteContent } from '@/content/ContentContext';
import type { BlogContentBlock, BlogImage, BlogPost, SocialLink } from '@/content/types';
import { resolveVideoLink } from '@/content/video';
import { AfricaFilledMap, AfricaPhoto, AfricaShape } from '@/components/AfricaMap';

const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  whatsapp: Smartphone,
} as const;

const programIconMap: Record<string, typeof Users> = {
  users: Users,
  graduation: GraduationCap,
  shield: Shield,
  book: BookOpen,
  globe: Globe2,
  scale: Scale,
  leaf: Leaf,
  heart: HeartHandshake,
};

type RevealProps = { children: ReactNode; className?: string };

function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const navItems = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Programs', href: '/programs' },
  { label: 'Care School', href: '/programs/care-school' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
];

function navIsActive(location: string, href: string) {
  if (location === href) return true;
  const coveredByLongerItem = navItems.some(
    (item) => item.href !== href && item.href.startsWith(`${href}/`) && (location === item.href || location.startsWith(`${item.href}/`)),
  );
  if (coveredByLongerItem) return false;
  return location.startsWith(`${href}/`);
}



const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Creation Care Foundation | Caring for people and God’s creation',
    description:
      'Creation Care Foundation is a Christian organization mentoring, protecting, educating, and empowering communities while faithfully caring for God’s creation.',
  },
  '/about': {
    title: 'About Us | Creation Care Foundation',
    description:
      'Learn our Christ-centered vision, mission, and belief that every person is created in God’s image and called to care for creation.',
  },
  '/programs': {
    title: 'Our Programs | Creation Care Foundation',
    description:
      'Explore Biblical mentorship, Christian education, child protection, discipleship, human dignity, climate care, and more.',
  },
  '/programs/care-school': {
    title: 'Care Nursery & Primary School | Creation Care Foundation',
    description:
      'Care Nursery and Primary School invests in children with quality early childhood and primary education that builds character and community.',
  },
  '/team': {
    title: 'Team & Leadership | Creation Care Foundation',
    description:
      'Meet the servant-leadership team guiding Creation Care Foundation’s Christian mission and programs.',
  },
  '/get-involved': {
    title: 'Get Involved | Creation Care Foundation',
    description:
      'Volunteer, become a mentor, partner, pray, or donate to support Creation Care Foundation’s mission.',
  },
  '/donate': {
    title: 'Donate | Creation Care Foundation',
    description:
      'Your giving helps mentor young people, protect children, support communities, and care for God’s creation.',
  },
  '/contact': {
    title: 'Contact Us | Creation Care Foundation',
    description:
      'Connect with Creation Care Foundation in Kicukiro Masaka, Kigali — volunteer, partner, or learn more.',
  },
    '/blog': {
    title: 'Blog | Creation Care Foundation',
    description:
      'Articles from Creation Care Foundation on education, Care Nursery and Primary School, and biblical mentorship in Kigali, Rwanda.',
  },
  '/gallery': {
    title: 'Gallery | Creation Care Foundation',
    description:
      'Photographs from Creation Care Foundation’s mentorship, education, child protection, and community work.',
  },
};

function Seo({ path }: { path: string }) {
  const { content } = useSiteContent();
  useEffect(() => {
    const meta = content.pageMeta[path] ?? pageMeta[path] ?? pageMeta['/'];
    const image = path === '/' ? '/hero-africa.jpg' : content.blogPosts[0]?.cover.src || '/hero-africa.jpg';
    applySeo({
      title: meta.title,
      description: meta.description,
      path,
      image,
      jsonLd: organizationJsonLd(content.contact),
    });
  }, [path, content]);
  return null;
}

function BrandMark({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex min-w-0 items-center" data-testid="link-brand">
      <img
        src={dark ? creationCareLogo : creationCareLogoLight}
        alt="Creation Care Foundation"
        className={
          compact
            ? 'h-9 w-auto max-w-[min(68vw,220px)] object-contain object-left sm:h-10 sm:max-w-[260px] lg:h-11 lg:max-w-[300px]'
            : 'h-12 w-auto max-w-[min(78vw,280px)] object-contain object-left sm:h-14 sm:max-w-[340px] lg:h-16 lg:max-w-[400px]'
        }
        data-testid="img-brand-mark"
      />
    </Link>
  );
}

function SiteHeader({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const onLight = light && !scrolled && !menuOpen;
  const navColor = onLight ? 'text-[#173d32]/75 hover:text-[#1d664d]' : 'text-[#f7f3e8]/90 hover:text-[#f2b857]';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        onLight
          ? 'border-b border-transparent bg-transparent text-[#173d32]'
          : scrolled || menuOpen
            ? 'border-b border-[#f7f3e8]/10 bg-[#173d32]/95 text-[#f7f3e8] shadow-[0_12px_40px_rgba(10,30,24,0.35)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent text-[#f7f3e8]'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-5 py-2.5 sm:px-8 sm:py-3 lg:px-12">
        <BrandMark compact dark={onLight} />
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = navIsActive(location, item.href);
            return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring relative text-[11px] font-bold uppercase tracking-[.1em] transition-colors ${active ? 'text-[#f2b857]' : navColor}`}
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
              {active && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-[#f2b857]" aria-hidden="true" />
              )}
            </Link>
            );
          })}
          <Link
            href="/donate"
            className="focus-ring rounded-full bg-[#f2b857] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-transform hover:-translate-y-0.5"
            data-testid="link-nav-donate"
          >
            Donate
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`focus-ring rounded-full border p-2.5 xl:hidden ${onLight ? 'border-[#173d32]/20 text-[#173d32]' : 'border-[#f7f3e8]/30 text-[#f7f3e8]'}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>
      {menuOpen && (
        <div
          id="mobile-nav-panel"
          className="border-t border-[#f7f3e8]/10 bg-[#173d32] px-5 pb-6 pt-2 sm:px-8 xl:hidden"
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`focus-ring border-b border-[#f7f3e8]/10 py-4 text-sm font-bold uppercase tracking-[.12em] ${
                  navIsActive(location, item.href) ? 'text-[#f2b857]' : 'text-[#f7f3e8]'
                }`}
                data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="focus-ring mt-4 inline-flex items-center justify-center rounded-full bg-[#f2b857] px-5 py-4 text-sm font-bold uppercase tracking-[.12em] text-[#173d32]"
              data-testid="link-mobile-donate"
            >
              Donate Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  const { content } = useSiteContent();
  const contactInfo = content.contact;
  const socialLinks = content.socialLinks.map((link: SocialLink) => ({
    ...link,
    Icon: socialIconMap[link.icon] ?? Smartphone,
  }));

  return (
    <footer className="bg-[#173d32] pt-14 text-[#f7f3e8] sm:pt-16">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-10 lg:px-12">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-[320px] text-sm leading-relaxed text-[#f7f3e8]/55">
            Creation Care Foundation is a Christian organization caring for God’s creation, developing people, protecting children, and serving vulnerable communities.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-[#f7f3e8]/20 text-[#f7f3e8] transition-colors hover:border-[#47c6b3] hover:bg-[#47c6b3] hover:text-[#173d32]"
                data-testid={`link-footer-social-${label.toLowerCase()}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]">Explore</p>
          <nav className="mt-5 flex flex-col gap-3" aria-label="Footer navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring text-sm text-[#f7f3e8]/70 transition-colors hover:text-[#f2b857]"
                data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/donate" className="focus-ring text-sm font-semibold text-[#f2b857]" data-testid="link-footer-donate">
              Donate
            </Link>
          </nav>
        </div>

        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]">Contact</p>
          <div className="mt-5 space-y-4 text-sm text-[#f7f3e8]/70">
            <p className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#47c6b3]" />
              <span>{contactInfo.address}</span>
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="focus-ring flex items-start gap-3 transition-colors hover:text-[#f2b857]"
              data-testid="link-footer-email"
            >
              <Mail size={16} className="mt-0.5 shrink-0 text-[#47c6b3]" />
              <span>{contactInfo.email}</span>
            </a>
            <a
              href={`tel:${contactInfo.phonePrimaryTel}`}
              className="focus-ring flex items-start gap-3 transition-colors hover:text-[#f2b857]"
              data-testid="link-footer-phone"
            >
              <Phone size={16} className="mt-0.5 shrink-0 text-[#47c6b3]" />
              <span>{contactInfo.phonePrimary}</span>
            </a>
            <a
              href={`tel:${contactInfo.phoneSecondaryTel}`}
              className="focus-ring flex items-start gap-3 transition-colors hover:text-[#f2b857]"
              data-testid="link-footer-phone-2"
            >
              <Phone size={16} className="mt-0.5 shrink-0 text-[#47c6b3]" />
              <span>{contactInfo.phoneSecondary}</span>
            </a>
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]">Newsletter</p>
          <p className="mt-5 text-sm leading-relaxed text-[#f7f3e8]/65">
            {content.home.newsletterCopy}
          </p>
          <NewsletterSignup compact />
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1280px] flex-col gap-3 border-t border-[#f7f3e8]/15 px-5 py-6 font-mono text-[9px] uppercase tracking-[.16em] text-[#f7f3e8]/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Creation Care Foundation · CCF · Kigali, Rwanda</span>
        <span>Christ-centered care · Open to partners worldwide</span>
      </div>
    </footer>
  );
}

function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#173d32] pb-20 pt-36 text-[#f7f3e8] sm:pb-28 lg:pb-32">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-36 top-12 h-[600px] w-[600px] rounded-full border border-[#47c6b3]/20" />
      <div className="absolute -right-12 top-36 h-[420px] w-[420px] rounded-full border border-[#f2b857]/20" />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#47c6b3]">
            <span className="h-px w-10 bg-[#47c6b3]" /> {eyebrow}
          </div>
        </Reveal>
        <Reveal className="delay-1">
          <h1 className="max-w-[900px] font-display text-[clamp(2.6rem,7vw,6.2rem)] leading-[.92] tracking-[-.05em] text-balance">
            {title}
          </h1>
        </Reveal>
        <Reveal className="delay-2">
          <p className="mt-8 max-w-[680px] text-base leading-relaxed text-[#f7f3e8]/68 sm:text-lg">{copy}</p>
        </Reveal>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">{children}</p>;
}

function accentClass(accent: string) {
  if (accent === 'sun') return 'bg-[#f2b857]';
  if (accent === 'blue') return 'bg-[#79b4c3]';
  if (accent === 'leaf') return 'bg-[#7cbc8a]';
  return 'bg-[#47c6b3]';
}

function BlogCoverImage({
  image,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  image: BlogImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function postHasVideo(post: Pick<BlogPost, 'content'>) {
  return post.content.some((block) => block.type === 'video' && block.url.trim());
}

function BlogVideoPlayer({ url, title }: { url: string; title: string }) {
  const video = resolveVideoLink(url);
  if (video.kind === 'empty') return null;
  if (video.kind === 'embed') {
    return (
      <iframe
        src={video.src}
        title={video.title}
        className="aspect-video w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  if (video.kind === 'file') {
    return <video src={video.src} controls playsInline preload="metadata" className="aspect-video w-full bg-black" />;
  }
  if (video.kind === 'link') {
    return (
      <a href={video.href} target="_blank" rel="noreferrer" className="flex aspect-video items-center justify-center bg-[#173d32] px-6 text-center text-sm font-semibold text-[#f7f3e8]">
        Open video: {title}
      </a>
    );
  }
  return (
    <p className="px-5 py-6 text-sm text-[#173d32]/65">
      This video link could not be played. Paste a YouTube, Vimeo, or direct video file link.
    </p>
  );
}

function BlogArticleBlock({ block, index }: { block: BlogContentBlock; index: number }) {
  if (block.type === 'video') {
    if (!block.url.trim()) return null;
    return (
      <figure className="overflow-hidden rounded-[1.5rem] border border-[#173d32]/10 bg-[#e4eee9]" data-testid={`video-blog-body-${index}`}>
        <BlogVideoPlayer url={block.url} title={block.caption || 'Article video'} />
        {block.caption ? (
          <figcaption className="px-5 py-3 text-sm leading-relaxed text-[#173d32]/65 sm:px-6">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === 'image') {
    return (
      <figure className="overflow-hidden rounded-[1.5rem] border border-[#173d32]/10 bg-[#e4eee9]" data-testid={`img-blog-body-${index}`}>
        <div className="aspect-[16/10] overflow-hidden">
          <BlogCoverImage image={block} sizes="(max-width: 900px) 100vw, 760px" />
        </div>
        {block.caption ? (
          <figcaption className="px-5 py-3 text-sm leading-relaxed text-[#173d32]/65 sm:px-6">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <p className="text-base leading-[1.9] text-[#173d32]/78 sm:text-lg">
      {block.text}
    </p>
  );
}

function FloatingActions() {
  const { content } = useSiteContent();
  const whatsapp = content.socialLinks.find((link) => link.icon === 'whatsapp')?.href
    ?? `https://wa.me/${content.contact.phonePrimaryTel.replace('+', '')}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#173d32] px-4 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#f7f3e8] shadow-[0_12px_30px_rgba(23,61,50,0.35)] transition-transform hover:-translate-y-0.5"
        data-testid="link-float-whatsapp"
      >
        <Smartphone size={16} className="text-[#47c6b3]" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
      <Link
        href="/donate"
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-4 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#173d32] shadow-[0_12px_30px_rgba(242,184,87,0.4)] transition-transform hover:-translate-y-0.5"
        data-testid="link-float-donate"
      >
        <HeartHandshake size={16} />
        Donate
      </Link>
    </div>
  );
}

function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const { content } = useSiteContent();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    const result = await submitContactMessage({
      name: 'Newsletter subscriber',
      email: email.trim(),
      subject: 'Newsletter signup',
      message: 'Please add this email to Creation Care Foundation mission updates.',
    });
    if (!result.ok) return;
    setEmailSent(result.emailSent);
    setDone(true);
  };

  if (done) {
    return (
      <p className={`text-sm ${compact ? 'text-[#f7f3e8]/75' : 'text-[#173d32]/75'}`} data-testid="status-newsletter-success">
        {emailSent
          ? 'Thank you. A confirmation is on its way to your inbox.'
          : 'Thank you — we will keep you close to the mission.'}
      </p>
    );
  }

  return (
    <form onSubmit={(event) => void submit(event)} className={compact ? 'mt-4' : 'mt-8'} data-testid="form-newsletter">
      {!compact && (
        <>
          <SectionLabel>Stay connected</SectionLabel>
          <h2 className="mt-4 max-w-[560px] font-display text-3xl tracking-[-.03em] text-[#173d32] sm:text-4xl">
            {content.home.newsletterTitle}
          </h2>
          <p className="mt-3 max-w-[480px] text-sm leading-relaxed text-[#173d32]/65">{content.home.newsletterCopy}</p>
        </>
      )}
      <div className={`flex flex-col gap-3 sm:flex-row ${compact ? '' : 'mt-6'}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className={`focus-ring flex-1 rounded-full border px-5 py-3 text-sm outline-none ${
            compact
              ? 'border-[#f7f3e8]/25 bg-[#173d32] text-[#f7f3e8] placeholder:text-[#f7f3e8]/40'
              : 'border-[#173d32]/20 bg-white text-[#173d32]'
          }`}
          data-testid="input-newsletter-email"
        />
        <button
          type="submit"
          className={`focus-ring rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[.14em] ${
            compact ? 'bg-[#47c6b3] text-[#173d32]' : 'bg-[#173d32] text-[#f7f3e8]'
          }`}
          data-testid="button-newsletter-submit"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}

function FaqList() {
  const { content } = useSiteContent();
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {content.faqs.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-[1.25rem] border border-[#173d32]/12 bg-[#f7f3e8]">
            <button
              type="button"
              className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              data-testid={`button-faq-${index + 1}`}
            >
              <span className="font-display text-lg tracking-[-.02em] text-[#173d32] sm:text-xl">{item.question}</span>
              <ChevronDown size={18} className={`shrink-0 text-[#1d664d] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <p className="border-t border-[#173d32]/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-[#173d32]/7">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Home() {
  const { content } = useSiteContent();
  const blogPosts = content.blogPosts;
  const programs = content.programs;
  const home = content.home;

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/hero-africa.jpg';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f6f3ea]">
      <Seo path="/" />
      <SiteHeader light />
      <section
        className="relative overflow-hidden bg-[#f6f3ea] pb-16 pt-28 text-[#173d32] sm:pb-20 sm:pt-32"
        aria-labelledby="hero-title"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(23,61,50,0.16) 1.1px, transparent 1.2px)',
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 42%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 42%, #000 100%)',
          }}
        />
        <span className="pointer-events-none absolute left-[42%] top-36 hidden h-3 w-3 rounded-full bg-[#f2b857] lg:block" />
        <span className="pointer-events-none absolute right-[18%] top-28 hidden h-2.5 w-2.5 rounded-full bg-[#1d664d] lg:block" />
        <span className="pointer-events-none absolute right-[8%] bottom-24 hidden h-3 w-3 rounded-full bg-[#47c6b3] lg:block" />
        <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-[1280px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-8 lg:px-12">
          <div className="min-w-0">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.2em] text-[#1d664d]">{home.heroEyebrow}</p>
            </Reveal>
            <Reveal className="delay-1">
              <h1 id="hero-title" className="mt-5 max-w-full font-display text-[clamp(2.45rem,8vw,5.6rem)] leading-[.95] tracking-[-.045em] text-balance text-[#173d32]">
                {home.heroTitleLine1}<br />
                <span className="text-[#1d664d]">{home.heroTitleEmphasis}</span> {home.heroTitleLine2}
              </h1>
            </Reveal>
            <Reveal className="delay-2">
              <p className="mt-6 max-w-[min(100%,460px)] text-base leading-relaxed text-[#173d32]/65 sm:text-lg">
                {home.heroCopy}
              </p>
            </Reveal>
            <Reveal className="delay-3">
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/donate"
                  className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-0.5"
                  data-testid="link-hero-donate"
                >
                  Donate now
                </Link>
                <Link
                  href="/get-involved"
                  className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]"
                  data-testid="link-hero-involve"
                >
                  Get involved <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="delay-2 min-w-0">
            <div className="relative mx-auto w-full max-w-[460px]" data-testid="img-hero-africa">
              <AfricaPhoto
                src="/hero-africa.jpg"
                alt="Children gathered with a mentor outside the school, framed in the shape of Africa"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#f6f3ea] py-16 sm:py-24" aria-labelledby="home-difference-title">
        <AfricaShape className="pointer-events-none absolute -left-24 bottom-0 hidden w-[420px] text-[#173d32]/[0.05] lg:block" />
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[.2em] text-[#1d664d]">How we serve</p>
            <h2 id="home-difference-title" className="mx-auto mt-3 max-w-[640px] text-center font-display text-4xl tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {home.impactTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-center text-sm leading-relaxed text-[#173d32]/60">{home.impactCopy}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programs.slice(0, 4).map((program, index) => {
              const Icon = programIconMap[String(program.icon)] ?? Leaf;
              return (
                <Reveal key={program.id} className={`delay-${Math.min(index + 1, 3)}`}>
                  <article className="h-full rounded-[1.5rem] bg-white p-6 text-center shadow-[0_16px_40px_rgba(23,61,50,0.06)]" data-testid={`card-home-program-${program.id}`}>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f3ea] text-[#1d664d]">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-[#173d32]">{program.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#173d32]/60">{program.copy}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f6f3ea] py-8 sm:py-16" aria-labelledby="home-knowledge-title">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <div className="relative mx-auto h-[340px] w-full max-w-[460px] sm:h-[420px]">
              <span className="absolute left-6 top-10 h-3 w-3 rounded-full bg-[#47c6b3]" />
              <span className="absolute bottom-16 right-8 h-3 w-3 rounded-full bg-[#f2b857]" />
              {[
                {
                  src: '/home-circle-classroom.jpg',
                  alt: 'Young people and mentors gathered in a classroom',
                  className: 'left-10 top-8 h-56 w-56 object-[center_35%] sm:h-72 sm:w-72',
                  priority: true,
                },
                {
                  src: '/home-circle-play.jpg',
                  alt: 'Children playing together outside the school',
                  className: 'right-0 top-0 h-28 w-28 border-4 border-[#f6f3ea] object-[center_40%] sm:h-36 sm:w-36',
                  priority: false,
                },
                {
                  src: '/home-circle-meal.png',
                  alt: 'Children sharing a meal together',
                  className: 'bottom-4 left-0 h-24 w-24 border-4 border-[#f6f3ea] sm:h-28 sm:w-28',
                  priority: false,
                },
              ].map((photo) => (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  loading={photo.priority ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={photo.priority ? 'high' : 'low'}
                  className={`absolute rounded-full object-cover shadow-[0_16px_40px_rgba(23,61,50,0.16)] ${photo.className}`}
                />
              ))}
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.2em] text-[#1d664d]">About us</p>
            <h2 id="home-knowledge-title" className="mt-3 max-w-[520px] font-display text-4xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {home.visionTitle}
            </h2>
            <p className="mt-5 max-w-[480px] text-sm leading-relaxed text-[#173d32]/65 sm:text-base">{home.missionCopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#173d32] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-hero-about">
                Learn more
              </Link>
              <Link href={blogPosts.some(postHasVideo) ? `/blog/${blogPosts.find(postHasVideo)?.slug}` : '/blog'} className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#173d32]/15 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-watch">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d664d] text-white"><Play size={12} fill="currentColor" /></span>
                Watch video
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f6f3ea] py-16 sm:py-24" aria-labelledby="home-programs-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[.2em] text-[#1d664d]">The work itself</p>
            <h2 id="home-programs-title" className="mx-auto mt-3 max-w-[680px] text-center font-display text-4xl tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {home.programsTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {programs.slice(0, 3).map((program, index) => {
              const photo = {
                'biblical-mentorship': {
                  src: '/blog/mentoring-circle.png',
                  alt: 'Mentors and neighbors standing together in a circle',
                },
                'christian-education': {
                  src: '/blog/care-lesson.jpg',
                  alt: 'Children seated for a lesson at Care Nursery and Primary School',
                },
                'child-protection': {
                  src: '/gallery/children-gathered.jpg',
                  alt: 'Children gathered together indoors',
                },
              }[program.id] ?? blogPosts[index]?.cover;
              return (
                <Reveal key={program.id} className={`delay-${Math.min(index + 1, 3)}`}>
                  <article className="overflow-hidden rounded-[1.6rem] bg-white shadow-[0_18px_50px_rgba(23,61,50,0.08)]" data-testid={`card-home-feature-${program.id}`}>
                    {photo?.src ? (
                      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                    ) : null}
                    <div className="p-6">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">{program.category}</p>
                      <h3 className="mt-3 font-display text-2xl leading-tight text-[#173d32]">{program.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#173d32]/65">{program.copy}</p>
                      <Link
                        href={program.id === 'christian-education' ? '/programs/care-school' : '/programs'}
                        className="focus-ring mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#173d32]"
                        data-testid={`link-home-program-${program.id}`}
                      >
                        {program.id === 'christian-education' ? 'See Care School' : 'See programs'} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="delay-2">
            <Link
              href="/programs/care-school"
              className="focus-ring mt-8 grid items-center gap-6 overflow-hidden rounded-[1.6rem] bg-[#173d32] text-[#f7f3e8] sm:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
              data-testid="link-home-care-school"
            >
              <img src="/blog/care-lesson.jpg" alt="Children in a lesson at Care Nursery and Primary School" className="h-48 w-full object-cover sm:h-full" />
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#f2b857]">Care Nursery &amp; Primary School</p>
                <h3 className="mt-3 font-display text-3xl leading-tight">A safe school for young children.</h3>
                <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#f7f3e8]/70">
                  Care School teaches literacy, numbers, character, and care for others. Open the page to see the classroom and what the program includes.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#f2b857]">
                  Look at the program <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#f6f3ea] pb-8 pt-4 sm:pb-16" aria-labelledby="home-reach-title">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
          <Reveal className="min-w-0">
            <h2 id="home-reach-title" className="max-w-[420px] font-display text-4xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {home.reachTitle}
            </h2>
            <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-[#173d32]/65">{home.reachCopy}</p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {content.impactStats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl tracking-[-.04em] text-[#173d32] sm:text-5xl">{stat.value}</p>
                  <p className="mt-2 text-sm text-[#173d32]/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="delay-1 min-w-0">
            <AfricaFilledMap className="mx-auto block h-auto w-full max-w-[440px]" />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="home-blog-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-[#173d32]/15 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>04 / Blog</SectionLabel>
                <h2 id="home-blog-title" className="mt-4 max-w-[640px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
                  {home.blogTitle}
                </h2>
              </div>
              <Link href="/blog" className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-all-blog">
                Visit the blog <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Reveal key={post.slug} className={`delay-${Math.min(index + 1, 3)}`}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] transition-colors hover:border-[#173d32]/25"
                  data-testid={`card-home-blog-${post.slug}`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <BlogCoverImage
                      image={post.cover}
                      className="transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`w-fit rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(post.accent)}`}>
                        {post.category}
                      </span>
                      {postHasVideo(post) ? (
                        <span className="rounded-full bg-[#173d32] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#f7f3e8]">
                          Video
                        </span>
                      ) : null}
                    </span>
                    <div className="mt-5">
                      <h3 className="font-display text-2xl leading-[1.05] text-[#173d32]">{post.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28" aria-labelledby="home-voices-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>Voices</SectionLabel>
            <h2 id="home-voices-title" className="mt-4 max-w-[720px] font-display text-3xl leading-[.96] tracking-[-.03em] sm:text-5xl">
              {home.voicesTitle}
            </h2>
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-[#f7f3e8]/65">{home.voicesCopy}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {content.testimonials.map((item, index) => (
              <Reveal key={item.name} className={`delay-${Math.min(index + 1, 3)}`}>
                <blockquote className="flex h-full flex-col justify-between rounded-[1.5rem] border border-[#f7f3e8]/15 bg-[#f7f3e8]/5 p-6" data-testid={`card-testimonial-${index + 1}`}>
                  <p className="text-base leading-relaxed text-[#f7f3e8]/85">“{item.quote}”</p>
                  <footer className="mt-8">
                    <p className="font-semibold text-[#47c6b3]">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[.12em] text-[#f7f3e8]/5">
                      {item.role} · {item.location}
                    </p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="home-faq-title">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:px-12">
          <Reveal>
            <SectionLabel>FAQ</SectionLabel>
            <h2 id="home-faq-title" className="mt-4 font-display text-3xl tracking-[-.03em] text-[#173d32] sm:text-5xl">
              {home.faqTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#173d32]/65">{home.faqCopy}</p>
            <Link href="/contact" className="focus-ring mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#1d664d]">
              Ask another question <ArrowRight size={14} />
            </Link>
          </Reveal>
          <Reveal className="delay-1">
            <FaqList />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e4eee9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <NewsletterSignup />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <Reveal>
            <SectionLabel>05 / Call to action</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-6xl">
              {home.ctaTitle}
            </h2>
            <p className="mt-6 max-w-[520px] text-sm leading-relaxed text-[#f7f3e8]/65">
              {home.ctaCopy}
            </p>
          </Reveal>
          <Reveal className="delay-1">
            <div className="flex flex-wrap gap-4">
              <Link href="/get-involved" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-cta-involve">
                Get involved <ArrowRight size={16} />
              </Link>
              <Link href="/donate" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#f7f3e8]/30 px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-home-cta-donate">
                Donate now
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function About() {
  const { content } = useSiteContent();
  const about = content.about;
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/about" />
      <SiteHeader />
      <PageIntro
        eyebrow={about.intro.eyebrow}
        title={<>{about.intro.title}</>}
        copy={about.intro.copy}
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-24 lg:px-12">
          <Reveal>
            <SectionLabel>01 / What we believe</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {about.believeTitle}
            </h2>
          </Reveal>
          <Reveal className="delay-1">
            <p className="text-[clamp(1.2rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-.025em] text-[#173d32]">
              {about.believeLead}
            </p>
            <p className="mt-8 text-base leading-[1.8] text-[#173d32]/65">
              {about.believeBody}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <article className="h-full rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">02 / Vision</span>
              <h2 className="mt-10 font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
                {about.visionTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#f7f3e8]/65">
                {about.visionCopy}
              </p>
            </article>
          </Reveal>
          <Reveal className="delay-1">
            <article className="h-full rounded-[2rem] bg-[#f2b857] p-8 text-[#173d32] sm:p-12">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#173d32]/70">03 / Mission</span>
              <h2 className="mt-10 font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
                {about.missionTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#173d32]/70">
                {about.missionCopy}
              </p>
            </article>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>04 / Care Nursery &amp; Primary School</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
              {about.schoolTitle}
            </h2>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-[#173d32]/65">
              {about.schoolCopy}
            </p>
            <Link
              href="/programs/care-school"
              className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]"
              data-testid="link-about-care-school"
            >
              Learn about the school <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Programs() {
  const { content } = useSiteContent();
  const programs = content.programs;
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs" />
      <SiteHeader />
      <PageIntro
        eyebrow={content.programsPage.intro.eyebrow}
        title={<>{content.programsPage.intro.title}</>}
        copy={content.programsPage.intro.copy}
      />
      <section className="bg-[#f7f3e8] pb-4 pt-8">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Link
            href="/programs/care-school"
            className="focus-ring grid items-center gap-6 overflow-hidden rounded-[1.75rem] border border-[#173d32]/12 bg-white sm:grid-cols-[240px_1fr]"
            data-testid="link-programs-care-school-banner"
          >
            <img src="/blog/care-classroom.jpg" alt="Children listening during a Care School lesson" className="h-52 w-full object-cover sm:h-full" />
            <div className="px-6 py-6 sm:px-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">Start here · Care School</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[#173d32] sm:text-4xl">Care Nursery and Primary School</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-[#173d32]/65">
                This is the school program: early childhood and primary classes in a safe room, with lessons in reading, numbers, character, and care for the community.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#173d32]">
                Open the school page <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <nav className="flex gap-3 overflow-x-auto pb-3" aria-label="Program navigation">
              {programs.map((program) => (
                <a
                  key={program.id}
                  href={`#${program.id}`}
                  className="focus-ring shrink-0 rounded-full border border-[#173d32]/20 bg-[#f7f3e8] px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]"
                  data-testid={`link-program-nav-${program.id}`}
                >
                  {program.category}
                </a>
              ))}
            </nav>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {programs.map((program, index) => {
              const Icon = programIconMap[String(program.icon)] ?? Leaf;
              return (
                <Reveal key={program.id} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                  <article
                    id={program.id}
                    className="group min-h-[340px] scroll-mt-8 rounded-[2rem] border border-[#173d32]/12 bg-[#f7f3e8] p-8 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8] sm:p-10"
                    data-testid={`card-program-${program.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{program.number}</span>
                      <div className={`rounded-full p-3 ${accentClass(program.accent)}`}>
                        <Icon size={22} className="text-[#173d32]" />
                      </div>
                    </div>
                    <div className="mt-16">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#1d664d] group-hover:text-[#47c6b3]">{program.category}</p>
                      <h3 className="mt-3 font-display text-3xl leading-[.98] tracking-[-.03em] sm:text-4xl">{program.title}</h3>
                      <p className="mt-5 text-sm leading-[1.75] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{program.copy}</p>
                      {program.id === 'christian-education' ? (
                        <Link href="/programs/care-school" className="focus-ring mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#1d664d] group-hover:text-[#f2b857]" data-testid="link-program-card-care-school">
                          See Care School <ArrowRight size={15} />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>Featured · Care School</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Care Nursery &amp; Primary School Education
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#173d32]/65">
              Quality early childhood and primary education that develops knowledge, confidence, creativity, character, and practical skills.
            </p>
            <Link
              href="/programs/care-school"
              className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]"
              data-testid="link-programs-care-school"
            >
              Open school page <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal className="delay-1">
            <div className="overflow-hidden rounded-[2rem] border border-[#173d32]/12 bg-[#e4eee9]">
              <img src="/blog/care-group.jpg" alt="Children and teachers together at Care Nursery and Primary School" className="h-[220px] w-full object-cover sm:h-[280px]" />
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">Educating minds · Shaping character</p>
                <p className="mt-3 text-sm leading-relaxed text-[#173d32]/70">
                  True education develops strong character, discovers God-given purpose, and teaches service with love, humility, and compassion.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function CareSchool() {
  const { content } = useSiteContent();
  const school = content.careSchool;

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs/care-school" />
      <SiteHeader />
      <PageIntro
        eyebrow={school.intro.eyebrow}
        title={<>{school.intro.title}</>}
        copy={school.intro.copy}
      />
      <section className="bg-[#f7f3e8] pb-6 pt-8" aria-label="Care School photographs">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            { src: '/blog/care-lesson.jpg', alt: 'A teacher leading children at Care Nursery and Primary School', caption: 'Lessons in the school room' },
            { src: '/blog/care-classroom.jpg', alt: 'Children listening and taking part in class', caption: 'Children take part' },
            { src: '/gallery/school-uniforms.jpg', alt: 'Children dressed for school', caption: 'Ready for school' },
          ].map((photo) => (
            <figure key={photo.src} className="overflow-hidden rounded-[1.5rem] bg-white">
              <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-[#173d32]/70">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
          <Reveal>
            <SectionLabel>What this program is</SectionLabel>
            <h2 className="mt-4 font-display text-4xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Nursery and primary school, in one safe place.
            </h2>
          </Reveal>
          <Reveal className="delay-1">
            <ul className="space-y-4 text-sm leading-relaxed text-[#173d32]/75">
              <li>Young children come for early childhood and primary classes.</li>
              <li>They learn reading, numbers, communication, and how to think for themselves.</li>
              <li>Teachers also form character: care for classmates, the community, and the natural world.</li>
              <li>The aim is a child who can learn for life and take part in the community with dignity.</li>
            </ul>
            <Link href="/blog/care-nursery-and-primary-school" className="focus-ring mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#1d664d]">
              Read the school article <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <Reveal>
            <p className="text-[clamp(1.25rem,2.6vw,1.9rem)] leading-[1.3] tracking-[-.03em] text-[#173d32]">
              {school.lead}
            </p>
            <p className="mt-8 text-base leading-[1.8] text-[#173d32]/65">
              {school.body}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>Why education matters</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              The early years build the foundation for the future.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {school.reasons.map((reason, index) => (
              <Reveal key={reason} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <div className="flex gap-4 rounded-2xl border border-[#173d32]/10 bg-[#f7f3e8] p-6" data-testid={`text-school-reason-${index + 1}`}>
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#47c6b3] font-mono text-[10px] font-bold text-[#173d32]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed text-[#173d32]/75">{reason}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
              Together, we can give children the opportunity to learn, grow, and build a better future.
            </h2>
            <p className="mx-auto mt-6 max-w-[620px] text-sm leading-relaxed text-[#f7f3e8]/65">
              Through partnerships and support, we can strengthen learning resources, improve facilities, equip teachers, and ensure more children have access to a safe and enriching educational environment.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/donate" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-school-donate">
                Support the school <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#f7f3e8]/30 px-6 py-4 text-xs font-bold uppercase tracking-[.14em]" data-testid="link-school-partner">
                Partner with us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Team() {
  const { content } = useSiteContent();
  const teamRoles = content.teamRoles;
  const teamValues = content.teamValues;
  const intro = content.teamPage.intro;
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/team" />
      <SiteHeader />
      <PageIntro
        eyebrow={intro.eyebrow}
        title={<>{intro.title}</>}
        copy={intro.copy}
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamRoles.map((role, index) => (
              <Reveal key={role.title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <article className="flex min-h-[240px] flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] p-7" data-testid={`card-team-${index + 1}`}>
                  <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-2xl leading-[1.05] text-[#173d32]">{role.title}</h3>
                    <p className="mt-4 text-sm leading-[1.7] text-[#173d32]/65">{role.copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>Our team values</SectionLabel>
            <h2 className="mt-5 max-w-[640px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              The character that guides our service.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamValues.map(([title, copy], index) => (
              <Reveal key={title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <div className="border-t-2 border-[#47c6b3] pt-5" data-testid={`card-value-${title.toLowerCase()}`}>
                  <h3 className="font-display text-2xl text-[#173d32]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function GetInvolved() {
  const { content } = useSiteContent();
  const involveWays = content.involveWays;
  const partnerTypes = content.partnerTypes;
  const intro = content.getInvolved.intro;
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/get-involved" />
      <SiteHeader />
      <PageIntro
        eyebrow={intro.eyebrow}
        title={<>{intro.title}</>}
        copy={intro.copy}
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
          {involveWays.map((way, index) => (
            <Reveal key={way.title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
              <Link
                href={way.href}
                className="group flex min-h-[240px] flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] p-7 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]"
                data-testid={`card-involve-${way.title.toLowerCase().replaceAll(' ', '-')}`}
              >
                <HandHeart size={24} className="text-[#1d664d] group-hover:text-[#47c6b3]" />
                <div>
                  <h3 className="font-display text-3xl leading-none">{way.title}</h3>
                  <p className="mt-4 text-sm leading-[1.7] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{way.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d] group-hover:text-[#47c6b3]">
                    Learn more <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>Partner with us</SectionLabel>
            <h2 className="mt-5 max-w-[760px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-6xl">
              Lasting change happens when people work together.
            </h2>
            <p className="mt-6 max-w-[560px] text-sm leading-relaxed text-[#f7f3e8]/65">
              We welcome partnerships with churches, schools, youth and community organizations, environmental groups, Christian leaders, and donors.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {partnerTypes.map((type) => (
              <span key={type} className="rounded-full border border-[#f7f3e8]/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#f7f3e8]/75">
                {type}
              </span>
            ))}
          </div>
          <Link
            href="/contact"
            className="focus-ring mt-10 inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]"
            data-testid="link-involve-partner"
          >
            Become a partner <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function DonationForm() {
  const { content } = useSiteContent();
  const donate = content.donate;
  const contactEmail = content.contact.email;
  const [amount, setAmount] = useState('5000');
  const [focus, setFocus] = useState('where-needed');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | 'card'>('momo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phase, setPhase] = useState<'form' | 'waiting' | 'success' | 'failed'>('form');
  const [payError, setPayError] = useState<string | null>(null);
  const [payMessage, setPayMessage] = useState<string | null>(null);
  const [customerRef, setCustomerRef] = useState<string | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref') || sessionStorage.getItem('ccf-donation-ref');
    if (!ref) return;
    setCustomerRef(ref);
    setPhase('waiting');
  }, []);

  useEffect(() => {
    if (phase !== 'waiting' || !customerRef) return;
    let cancelled = false;
    const tick = async () => {
      const result = await fetchDonationStatus(customerRef);
      if (cancelled || !result.payment) return;
      if (result.payment.paid) setPhase('success');
      else if (result.payment.failed) setPhase('failed');
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [phase, customerRef]);

  const paymentLabels = {
    momo: 'MTN MoMo',
    airtel: 'Airtel Money',
    card: 'Bank card',
  } as const;

  const paymentHints = {
    momo: donate.momoHint,
    airtel: donate.airtelHint,
    card: donate.cardHint,
  } as const;

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gift = Math.round(Number(amount));
    if (!name.trim() || !email.trim() || !phone.trim() || gift < 100) {
      setPayError('Enter your name, email, Rwanda phone number, and at least 100 RWF.');
      return;
    }
    setPayError(null);
    try {
      const result = await startLiveDonation({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount: gift,
        method: paymentMethod,
        focus,
      });
      if (!result.ok || !result.customerRef) {
        setPayError(result.error || 'The live payment could not start.');
        return;
      }
      setCustomerRef(result.customerRef);
      setPayMessage(result.message);
      setPhase('waiting');
      if (paymentMethod === 'card' && result.gatewayUrl) {
        sessionStorage.setItem('ccf-donation-ref', result.customerRef);
        window.location.assign(result.gatewayUrl);
      }
    } catch {
      setPayError('The payment service could not be reached. Try again in a moment.');
    }
  };

  if (phase === 'success') {
    return (
      <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-donation-success">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]">
          <Check size={27} />
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Payment received</p>
          <h2 className="mt-5 max-w-[500px] font-display text-4xl leading-[.94] sm:text-5xl">Your gift can help transform lives.</h2>
          <p className="mt-6 max-w-[480px] text-sm leading-relaxed text-[#f7f3e8]/65">
            XentriPay confirmed your live gift of {Number(amount).toLocaleString()} RWF via {paymentLabels[paymentMethod]}.
            Reference {customerRef}.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href={`mailto:${contactEmail}`} className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-donation-email">
            Email Creation Care <Mail size={15} />
          </a>
          <button type="button" onClick={() => { setPhase('form'); setCustomerRef(null); }} className="focus-ring inline-flex items-center gap-2 border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.14em] text-[#47c6b3]" data-testid="button-donation-again">
            Make another donation
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'waiting' || phase === 'failed') {
    return (
      <div className="flex min-h-[420px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-donation-pending">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">
            {phase === 'failed' ? 'Payment not completed' : 'Waiting for XentriPay'}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[.94]">
            {phase === 'failed' ? 'The gift was not confirmed.' : 'Finish the payment on your phone or card page.'}
          </h2>
          <p className="mt-5 max-w-[460px] text-sm leading-relaxed text-[#f7f3e8]/70">
            {payError || payMessage || 'This page checks the live payment status automatically.'}
          </p>
          {customerRef && <p className="mt-4 font-mono text-[11px] text-[#f2b857]">Reference {customerRef}</p>}
        </div>
        <button type="button" onClick={() => setPhase('form')} className="focus-ring self-start border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.14em] text-[#47c6b3]">
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void submitDonation(event)} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-donation">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Live gift · RWF</p>
          <p className="mt-2 text-sm text-[#173d32]/60">Paid securely through XentriPay. Minimum 100 RWF.</p>
        </div>
        <HeartHandshake size={24} className="text-[#1d664d]" />
      </div>
      <fieldset className="mt-8">
        <legend className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Choose an amount (RWF)</legend>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['1000', '5000', '10000', '25000', '50000', '100000'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              className={`focus-ring rounded-xl border py-3 text-sm font-bold transition-colors ${amount === value ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`}
              data-testid={`button-donation-amount-${value}`}
            >
              {Number(value).toLocaleString()}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Custom donation amount</span>
          <div className="flex items-center rounded-xl border border-[#173d32]/15 bg-[#f7f3e8] px-4">
            <span className="text-sm font-bold text-[#173d32]/45">RWF</span>
            <input type="number" min="100" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} className="focus-ring w-full bg-transparent px-2 py-3 text-sm text-[#173d32] outline-none" placeholder="Custom amount" data-testid="input-donation-amount" />
          </div>
        </label>
        <p className="mt-3 text-xs leading-relaxed text-[#173d32]/60">{donate.internationalNote}</p>
      </fieldset>
      <label className="mt-8 block">
        <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Where should your support go?</span>
        <select value={focus} onChange={(event) => setFocus(event.target.value)} className="focus-ring mt-3 w-full rounded-xl border border-[#173d32]/15 bg-[#f7f3e8] px-4 py-3 text-sm text-[#173d32] outline-none" data-testid="select-donation-focus">
          <option value="where-needed">Where it is needed most</option>
          <option value="mentorship">Biblical mentorship</option>
          <option value="education">Christian education</option>
          <option value="child-protection">Child protection</option>
          <option value="climate">Climate &amp; creation care</option>
          <option value="school">Care Nursery &amp; Primary School</option>
        </select>
      </label>
      <fieldset className="mt-8">
        <legend className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Payment method</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { id: 'momo' as const, label: 'MTN MoMo', hint: paymentHints.momo, Icon: Smartphone },
            { id: 'airtel' as const, label: 'Airtel Money', hint: paymentHints.airtel, Icon: Smartphone },
            { id: 'card' as const, label: 'Card', hint: paymentHints.card, Icon: CreditCard },
          ].map(({ id, label, hint, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPaymentMethod(id)}
              className={`focus-ring flex flex-col items-start rounded-xl border px-4 py-4 text-left transition-colors ${paymentMethod === id ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`}
              data-testid={`button-payment-${id}`}
            >
              <Icon size={18} className={paymentMethod === id ? 'text-[#47c6b3]' : 'text-[#1d664d]'} />
              <span className="mt-3 text-sm font-bold">{label}</span>
              <span className={`mt-1 text-[11px] ${paymentMethod === id ? 'text-[#f7f3e8]/60' : 'text-[#173d32]/55'}`}>{hint}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Your name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Full name" data-testid="input-donation-name" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email address</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@example.org" data-testid="input-donation-email" />
        </label>
      </div>
      {(paymentMethod === 'momo' || paymentMethod === 'airtel' || paymentMethod === 'card') && (
        <label className="mt-6 block">
          <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">
            {paymentMethod === 'momo'
              ? 'MTN MoMo phone number'
              : paymentMethod === 'airtel'
                ? 'Airtel Money phone number'
                : 'Phone number'}
          </span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            type="tel"
            name="phone"
            className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35"
            placeholder="+250 7XX XXX XXX"
            data-testid="input-donation-phone"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-[#173d32]/55">
            {paymentMethod === 'card'
              ? 'Live card checkout on XentriPay. You will open the secure card page next. Card numbers stay on that page.'
              : `Approve the ${paymentMethod === 'momo' ? 'MTN MoMo' : 'Airtel Money'} prompt on this number.`}
          </p>
        </label>
      )}
      {payError && <p className="mt-4 text-sm text-[#b45309]">{payError}</p>}
      <button type="submit" className="focus-ring mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-donation">
        Pay {Number(amount) > 0 ? Number(amount).toLocaleString() : '0'} RWF via {paymentLabels[paymentMethod]} <ArrowRight size={16} />
      </button>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#173d32]/55">
        Live XentriPay checkout. Mobile money sends a phone prompt. Cards open a secure payment page.
      </p>
    </form>
  );
}

function Donate() {
  const { content } = useSiteContent();
  const donate = content.donate;
  const donationSupports = content.donationSupports;
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/donate" />
      <SiteHeader />
      <PageIntro
        eyebrow={donate.intro.eyebrow}
        title={<>{donate.intro.title}</>}
        copy={donate.intro.copy}
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Why give</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              {donate.whyTitle}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#173d32]/65">
              {donate.whyLead}
            </p>
            <ul className="mt-5 space-y-3">
              {donationSupports.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#173d32]/75">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#47c6b3]" />
                  {item}
                </li>
              ))}
            </ul>
            <blockquote className="mt-10 border-l-2 border-[#f2b857] pl-5 text-sm leading-relaxed text-[#173d32]/70 italic">
              “Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”
            </blockquote>
            <div className="mt-10 rounded-2xl bg-[#f2b857] p-6 text-[#173d32]">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]/70">Our commitment to stewardship</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/75">
                {donate.paymentNote}
              </p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <DonationForm />
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Contact() {
  const { content } = useSiteContent();
  const contactInfo = content.contact;
  const [sent, setSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;
    setSubmitError(null);
    const result = await submitContactMessage({
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      subject: formSubject.trim(),
      message: formMessage.trim(),
    });
    if (!result.ok) {
      setSubmitError(result.error ?? 'Could not send message. Please try again or email us directly.');
      return;
    }
    setEmailSent(result.emailSent);
    setSent(true);
  };

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/contact" />
      <SiteHeader />
      <PageIntro
        eyebrow={content.contactPage.intro.eyebrow}
        title={<>{content.contactPage.intro.title}</>}
        copy={content.contactPage.intro.copy}
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Contact information</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Creation Care Foundation
            </h2>
            <div className="mt-10 space-y-4 border-t border-[#173d32]/15 pt-6 text-sm text-[#173d32]/75">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-[#1d664d]" />
                {contactInfo.address}
              </p>
              <a href={`mailto:${contactInfo.email}`} className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-email">
                <Mail size={16} className="text-[#1d664d]" /> {contactInfo.email}
              </a>
              <a href={`tel:${contactInfo.phonePrimaryTel}`} className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone">
                <Phone size={16} className="text-[#1d664d]" /> {contactInfo.phonePrimary}
              </a>
              <a href={`tel:${contactInfo.phoneSecondaryTel}`} className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone-2">
                <Phone size={16} className="text-[#1d664d]" /> {contactInfo.phoneSecondary}
              </a>
            </div>
            <div className="mt-10 rounded-2xl bg-[#e4eee9] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">Partner with us</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">
                Together we can mentor the next generation, protect children, strengthen communities, uphold human dignity, and care for God’s creation.
              </p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            {sent ? (
              <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-contact-success">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]">
                  <Check size={26} />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Message received</p>
                  <h3 className="mt-5 max-w-[420px] font-display text-4xl leading-[.94] sm:text-5xl">Thank you, {formName.split(' ')[0]}.</h3>
                  <p className="mt-5 max-w-[380px] text-sm leading-relaxed text-[#f7f3e8]/65">
                    {emailSent
                      ? 'Your note is with the Creation Care team, and a confirmation is on its way to your inbox.'
                      : 'Your note is ready for the Creation Care team. We look forward to finding how we can work together.'}
                  </p>
                </div>
                <button type="button" onClick={() => setSent(false)} className="focus-ring self-start border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.15em] text-[#47c6b3]" data-testid="button-send-another">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={(event) => void submitForm(event)} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-contact">
                <div className="mb-8 flex items-center justify-between">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Send us a message</p>
                  <span className="font-display text-4xl text-[#47c6b3]">→</span>
                </div>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Name</span>
                  <input value={formName} onChange={(event) => setFormName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Your full name" data-testid="input-contact-name" />
                </label>
                <label className="mt-6 block">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email</span>
                  <input value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@organisation.org" data-testid="input-contact-email" />
                </label>
                <label className="mt-6 block">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Phone</span>
                  <input value={formPhone} onChange={(event) => setFormPhone(event.target.value)} name="phone" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="+250 ..." data-testid="input-contact-phone" />
                </label>
                <label className="mt-6 block">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Subject</span>
                  <input value={formSubject} onChange={(event) => setFormSubject(event.target.value)} name="subject" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Volunteer, partnership, donation..." data-testid="input-contact-subject" />
                </label>
                <label className="mt-6 block">
                  <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Message</span>
                  <textarea value={formMessage} onChange={(event) => setFormMessage(event.target.value)} required name="message" rows={4} className="focus-ring mt-3 w-full resize-none border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="How can we serve together?" data-testid="input-contact-message" />
                </label>
                {submitError && <p className="mt-4 text-sm text-[#b45309]">{submitError}</p>}
                <button type="submit" className="focus-ring mt-9 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-contact">
                  Send message <MoveRight size={16} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Blog() {
  const { content } = useSiteContent();
  const blogPosts = content.blogPosts;
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))];
  const featured = blogPosts[0];
  const filtered = blogPosts.filter((post) => category === 'All' || post.category === category);
  const list = category === 'All' ? filtered.slice(1) : filtered;

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/blog" />
      <SiteHeader />
      <PageIntro
        eyebrow={content.blogPage.intro.eyebrow}
        title={<>{content.blogPage.intro.title}</>}
        copy={content.blogPage.intro.copy}
      />

      <section className="bg-[#f7f3e8] pb-8 pt-4 sm:pb-10">
        <div className="mx-auto flex max-w-[1280px] gap-3 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`focus-ring shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] transition-colors ${category === item ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/20 bg-transparent text-[#173d32] hover:border-[#173d32]'}`}
              data-testid={`button-blog-category-${item.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {category === 'All' && (
        <section className="bg-[#f7f3e8] pb-10 sm:pb-14">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-[2rem] border border-[#173d32]/12 bg-[#173d32] text-[#f7f3e8] transition-transform hover:-translate-y-0.5 lg:grid-cols-[1.05fr_.95fr]"
                data-testid="card-blog-featured"
              >
                <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]">Featured · {featured.date}</p>
                    <h2 className="mt-5 max-w-[540px] font-display text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">
                      {featured.title}
                    </h2>
                    <p className="mt-5 max-w-[480px] text-sm leading-[1.75] text-[#f7f3e8]/65 sm:text-base">
                      {featured.excerpt}
                    </p>
                  </div>
                  <span className="mt-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#f2b857]">
                    Read full article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
                  <BlogCoverImage
                    image={featured.cover}
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#173d32]/55 via-transparent to-transparent" />
                  <p className={`absolute bottom-6 left-6 rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(featured.accent)}`}>
                    {featured.category}
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-[#e4eee9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#173d32]/15 pb-6">
              <div>
                <SectionLabel>{category === 'All' ? 'Latest articles' : category}</SectionLabel>
                <h2 className="mt-3 font-display text-3xl tracking-[-.03em] text-[#173d32] sm:text-4xl">
                  {list.length} {list.length === 1 ? 'article' : 'articles'}
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((post, index) => (
              <Reveal key={post.slug} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#173d32]/12 bg-[#f7f3e8] transition-colors hover:border-[#173d32]/25"
                  data-testid={`card-blog-${post.slug}`}
                >
                  <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden" data-testid={`img-blog-card-${post.slug}`}>
                    <BlogCoverImage
                      image={post.cover}
                      className="transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(post.accent)}`}>
                          {post.category}
                        </span>
                        {postHasVideo(post) ? (
                          <span className="rounded-full bg-[#173d32] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#f7f3e8]">
                            Video
                          </span>
                        ) : null}
                      </span>
                      <span className="font-mono text-[10px] tracking-[.12em] text-[#1d664d]">{post.date}</span>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-display text-2xl leading-[1.08] tracking-[-.03em] text-[#173d32] sm:text-3xl">{post.title}</h3>
                      <p className="mt-4 text-sm leading-[1.7] text-[#173d32]/65">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="focus-ring mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]"
                        data-testid={`link-blog-${post.slug}`}
                      >
                        Read article <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {list.length === 0 && (
            <p className="mt-8 text-sm text-[#173d32]/60">No articles in this category yet.</p>
          )}
        </div>
      </section>

      <section className="bg-[#173d32] py-16 text-[#f7f3e8] sm:py-20">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <SectionLabel>Keep the story going</SectionLabel>
            <h2 className="mt-4 max-w-[560px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
              Pray, give, mentor, or partner with Creation Care.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/get-involved" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-blog-cta-involve">
              Get involved
            </Link>
            <Link href="/donate" className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#f7f3e8]/30 px-5 py-3 text-xs font-bold uppercase tracking-[.14em]" data-testid="link-blog-cta-donate">
              Donate
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function BlogPost() {
  const { content } = useSiteContent();
  const blogPosts = content.blogPosts;
  const [, params] = useRoute('/blog/:slug');
  const post = blogPosts.find((item) => item.slug === params?.slug);
  const related = blogPosts.filter((item) => item.slug !== post?.slug).slice(0, 3);

  useEffect(() => {
    if (!post) return;
    applySeo({
      title: `${post.title} | Creation Care Foundation`,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.cover.src,
      type: 'article',
      jsonLd: articleJsonLd(post),
    });
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-[#173d32] pb-10 pt-36 text-[#f7f3e8] sm:pb-14">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="relative z-10 mx-auto max-w-[980px] px-5 sm:px-8">
          <Reveal>
            <Link href="/blog" className="focus-ring inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]" data-testid="link-back-blog">
              ← All blog posts
            </Link>
          </Reveal>
          <Reveal className="delay-1">
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(post.accent)}`}>
                {post.category}
              </span>
              <span className="font-mono text-[10px] tracking-[.14em] text-[#f7f3e8]/55">{post.date}</span>
              <span className="font-mono text-[10px] tracking-[.14em] text-[#f7f3e8]/40">Creation Care Foundation</span>
            </div>
            <h1 className="mt-6 max-w-[860px] font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[.95] tracking-[-.045em] text-balance">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-[#f7f3e8]/68 sm:text-lg">{post.excerpt}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f3e8] pb-8 pt-2 sm:pb-10">
        <div className="mx-auto max-w-[980px] px-5 sm:px-8">
          <Reveal>
            <figure className="overflow-hidden rounded-[1.75rem] border border-[#173d32]/10 shadow-[0_20px_60px_rgba(23,61,50,0.12)]" data-testid="img-blog-cover">
              <div className="aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
                <BlogCoverImage image={post.cover} sizes="(max-width: 980px) 100vw, 980px" priority />
              </div>
              {post.cover.caption ? (
                <figcaption className="bg-[#e4eee9] px-5 py-3 text-sm text-[#173d32]/65 sm:px-6">
                  {post.cover.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-10 sm:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_240px] lg:gap-16">
          <Reveal>
            <article className="space-y-8" data-testid="article-blog-body">
              {post.content.map((block, index) => (
                <BlogArticleBlock key={`${post.slug}-${index}`} block={block} index={index} />
              ))}
            </article>
            <div className="mt-12 flex flex-wrap gap-4 border-t border-[#173d32]/15 pt-8">
              <Link href="/donate" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-blog-donate">
                Support the work <ArrowRight size={16} />
              </Link>
              <Link href="/get-involved" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#173d32]/20 px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-blog-involve">
                Get involved
              </Link>
              <Link href="/contact" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#173d32]/20 px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-blog-contact">
                Contact us
              </Link>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <aside className="rounded-[1.5rem] border border-[#173d32]/12 bg-[#e4eee9] p-6 lg:sticky lg:top-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#1d664d]">In this mission</p>
              <p className="mt-4 text-sm leading-relaxed text-[#173d32]/7">
                Creation Care Foundation mentors, protects, educates, and empowers communities through Biblical principles.
              </p>
              <Link href="/programs" className="focus-ring mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]" data-testid="link-blog-programs">
                View programs <ChevronRight size={14} />
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e4eee9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>Keep reading</SectionLabel>
            <h2 className="mt-4 font-display text-3xl tracking-[-.03em] text-[#173d32] sm:text-4xl">Related articles</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} className={`delay-${Math.min(index + 1, 3)}`}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#173d32]/12 bg-[#f7f3e8] transition-colors hover:border-[#173d32]/25"
                  data-testid={`link-related-${item.slug}`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <BlogCoverImage
                      image={item.cover}
                      className="transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <span className={`w-fit rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(item.accent)}`}>
                      {item.category}
                    </span>
                    <div className="mt-5">
                      <h3 className="font-display text-2xl leading-[1.05] text-[#173d32]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">{item.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Gallery() {
  const { content } = useSiteContent();
  const intro = content.galleryPage.intro;
  const photos = content.gallery.filter((item) => item.src);
  const categories = ['All', ...Array.from(new Set(photos.map((item) => item.category).filter(Boolean)))];
  const [category, setCategory] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const visible = category === 'All' ? photos : photos.filter((item) => item.category === category);
  const activeIndex = visible.findIndex((item) => item.id === activeId);
  const active = activeIndex >= 0 ? visible[activeIndex] : null;

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null);
      if (event.key === 'ArrowRight') {
        const next = visible[(activeIndex + 1) % visible.length];
        if (next) setActiveId(next.id);
      }
      if (event.key === 'ArrowLeft') {
        const next = visible[(activeIndex - 1 + visible.length) % visible.length];
        if (next) setActiveId(next.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, activeIndex, visible]);

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/gallery" />
      <SiteHeader />
      <PageIntro eyebrow={intro.eyebrow} title={intro.title} copy={intro.copy} />
      <section className="bg-[#f7f3e8] py-16 sm:py-24" aria-label="Photo gallery">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          {categories.length > 1 ? (
            <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  className={`focus-ring rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.12em] ${
                    category === item ? 'bg-[#173d32] text-[#f7f3e8]' : 'bg-white text-[#173d32]'
                  }`}
                  onClick={() => setCategory(item)}
                  data-testid={`button-gallery-filter-${item.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
          {visible.length === 0 ? (
            <p className="rounded-[1.5rem] bg-white px-6 py-10 text-sm text-[#173d32]/65">Photographs will appear here once they are added in the admin gallery.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="focus-ring group overflow-hidden rounded-[1.5rem] bg-white text-left shadow-[0_16px_40px_rgba(23,61,50,0.06)]"
                  onClick={() => setActiveId(item.id)}
                  data-testid={`button-gallery-open-${item.id}`}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="p-5">
                    {item.category ? (
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">{item.category}</p>
                    ) : null}
                    <p className="mt-2 font-display text-2xl leading-tight text-[#173d32]">{item.caption || item.alt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      {active ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#173d32]/88 p-4" role="dialog" aria-modal="true" aria-label={active.alt}>
          <button type="button" className="focus-ring absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white" onClick={() => setActiveId(null)} aria-label="Close photo">
            <X size={18} />
          </button>
          {visible.length > 1 ? (
            <button
              type="button"
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white sm:left-6"
              aria-label="Previous photo"
              onClick={() => {
                const next = visible[(activeIndex - 1 + visible.length) % visible.length];
                if (next) setActiveId(next.id);
              }}
            >
              <ChevronRight className="rotate-180" size={18} />
            </button>
          ) : null}
          <figure className="w-full max-w-4xl">
            <img src={active.src} alt={active.alt} className="max-h-[72vh] w-full rounded-[1.25rem] object-contain" />
            <figcaption className="mt-4 text-center text-sm text-[#f7f3e8]">
              {active.category ? <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#47c6b3]">{active.category}</span> : null}
              {active.caption || active.alt}
            </figcaption>
          </figure>
          {visible.length > 1 ? (
            <button
              type="button"
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white sm:right-6"
              aria-label="Next photo"
              onClick={() => {
                const next = visible[(activeIndex + 1) % visible.length];
                if (next) setActiveId(next.id);
              }}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}
        </div>
      ) : null}
      <SiteFooter />
    </main>
  );
}

function AppRouter() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);

  return (
    <>
      <Suspense fallback={null}>
      <Switch>
        <Route path="/admin" component={AdminApp} />
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/programs" component={Programs} />
        <Route path="/programs/care-school" component={CareSchool} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/team" component={Team} />
        <Route path="/get-involved" component={GetInvolved} />
        <Route path="/donate" component={Donate} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      {!location.startsWith('/admin') && <FloatingActions />}
    </>
  );
}

function App() {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

  return (
    <ContentProvider>
      <WouterRouter base={base}>
        <AppRouter />
      </WouterRouter>
    </ContentProvider>
  );
}

export default App;
