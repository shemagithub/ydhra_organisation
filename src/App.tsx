import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Cross,
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
  Scale,
  Shield,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import referenceImage from '@/assets/ydhra-reference.png';
import creationCareLogo from '@/assets/creation-care-logo.png';
import NotFound from '@/pages/not-found';

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

const CONTACT_EMAIL = 'ydhrarwanda@gmail.com';
const CONTACT_PHONE_PRIMARY = '+250 788 557 229';
const CONTACT_PHONE_SECONDARY = '0788 423 418';
const CONTACT_ADDRESS = 'Kicukiro, Masaka, Kigali, Rwanda';

const navItems = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Programs', href: '/programs' },
  { label: 'Team & Leadership', href: '/team' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact Us', href: '/contact' },
];

const programAreas = [
  {
    id: 'biblical-mentorship',
    number: '01',
    icon: Users,
    category: 'Mentorship',
    title: 'Biblical Mentorship',
    copy: 'Walking alongside children, youth, and emerging leaders through Bible-based mentoring, character development, leadership training, prayer, and practical life guidance.',
    accent: 'teal',
  },
  {
    id: 'christian-education',
    number: '02',
    icon: GraduationCap,
    category: 'Education',
    title: 'Christian Education',
    copy: 'Educating minds, shaping character, and transforming lives through quality education that develops the whole person academically, spiritually, socially, and emotionally.',
    accent: 'sun',
  },
  {
    id: 'child-protection',
    number: '03',
    icon: Shield,
    category: 'Safeguarding',
    title: 'Child Protection',
    copy: 'Creating safe environments where children are protected from abuse, exploitation, neglect, and violence and are given opportunities to grow and flourish.',
    accent: 'blue',
  },
  {
    id: 'christian-discipleship',
    number: '04',
    icon: Cross,
    category: 'Discipleship',
    title: 'Christian Discipleship',
    copy: 'Helping people grow in their relationship with Jesus Christ through Bible study, prayer, spiritual formation, service, evangelism, and creation-care discipleship.',
    accent: 'leaf',
  },
  {
    id: 'culture-exchange',
    number: '05',
    icon: Globe2,
    category: 'Exchange',
    title: 'Culture Exchange & Study Trips',
    copy: 'Students from around the world share traditions through dance, food, games, and adventures. Study trips blend education with cultural immersion, inspiring unity, respect, and lifelong friendships.',
    accent: 'teal',
  },
  {
    id: 'human-rights',
    number: '06',
    icon: Scale,
    category: 'Dignity',
    title: 'Human Rights & Human Dignity',
    copy: 'Promoting the God-given dignity of every person and empowering communities to understand and protect human rights.',
    accent: 'sun',
  },
  {
    id: 'climate-creation-care',
    number: '07',
    icon: Leaf,
    category: 'Creation care',
    title: 'Climate Change & Creation Care',
    copy: "Equipping churches, young people, families, and communities to respond responsibly to climate change and care for God's creation.",
    accent: 'blue',
  },
  {
    id: 'refugees',
    number: '08',
    icon: HeartHandshake,
    category: 'Refugees',
    title: 'Refugees Program',
    copy: 'Serving displaced families and vulnerable communities with dignity, practical support, and Christ-centered care.',
    accent: 'leaf',
  },
];

const teamRoles = [
  {
    title: 'Founder & Executive Director',
    copy: 'Provides overall vision and strategic leadership for Creation Care Foundation and guides the organisation’s Christian mission and programs.',
  },
  {
    title: 'Program Director',
    copy: 'Coordinates mentoring, education, discipleship, child protection, and community programs.',
  },
  {
    title: 'Creation Care & Climate Program Coordinator',
    copy: 'Leads environmental education, climate action, community resilience, and creation-care initiatives.',
  },
  {
    title: 'Child Protection Coordinator',
    copy: 'Oversees child safeguarding, protection programs, training, and safe-environment initiatives.',
  },
  {
    title: 'Christian Mentorship & Discipleship Coordinator',
    copy: 'Develops Biblical mentorship and discipleship programs for children, youth, and emerging leaders.',
  },
  {
    title: 'Finance & Administration',
    copy: 'Supports responsible financial management, administration, accountability, and organisational operations.',
  },
];

const teamValues = [
  ['Faithfulness', 'Serving God and others with integrity'],
  ['Servanthood', 'Leading by serving'],
  ['Compassion', 'Caring for people and creation'],
  ['Integrity', 'Acting honestly and responsibly'],
  ['Justice', 'Upholding dignity and fairness'],
  ['Stewardship', 'Faithfully managing what God has entrusted to us'],
  ['Collaboration', 'Working together with churches, communities, and partners'],
];

const getInvolvedWays = [
  {
    title: 'Volunteer',
    copy: 'Offer your time and skills to support mentoring, education, safeguarding, and community programs.',
    href: '/contact',
  },
  {
    title: 'Become a Mentor',
    copy: 'Walk alongside children, youth, and emerging leaders through Bible-based mentoring and life guidance.',
    href: '/contact',
  },
  {
    title: 'Partner With Us',
    copy: 'Churches, schools, organisations, and donors can join us in lasting, Christ-centered change.',
    href: '/contact',
  },
  {
    title: 'Prayer',
    copy: 'Pray for our team, partners, and the communities we serve as we care for people and creation.',
    href: '/contact',
  },
  {
    title: 'Donate',
    copy: 'Your generosity helps mentor young people, protect children, educate families, and care for creation.',
    href: '/donate',
  },
];

const donationSupports = [
  'Biblical mentorship for children and youth',
  'Christian education and discipleship',
  'Child protection and safeguarding',
  'Human rights and dignity programs',
  'Climate and creation-care projects',
  'Environmental education',
  'Community development and resilience',
];

const partnerTypes = [
  'Churches and Christian ministries',
  'Schools and universities',
  'Youth organisations',
  'Community organisations',
  'Nonprofit organisations',
  'Environmental organisations',
  'Local communities',
  'Christian leaders and mentors',
  'Individuals and donors',
];

const schoolWhyPoints = [
  'Build strong foundations in literacy, numeracy, communication, and critical thinking.',
  'Encourage curiosity, creativity, and a love of learning.',
  'Give children opportunities to learn through practical and experiential activities.',
  'Promote care for others, the community, and the natural environment.',
  'Support children to become responsible and active members of society.',
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Creation Care Foundation | Caring for people and God’s creation',
    description:
      'Creation Care Foundation is a Christian organisation committed to caring for God’s creation, developing people, protecting children, and promoting human dignity.',
  },
  '/about': {
    title: 'About Us | Creation Care Foundation',
    description:
      'Learn about Creation Care Foundation’s Christ-centered vision, mission, and belief that every person is created in God’s image.',
  },
  '/programs': {
    title: 'Our Programs | Creation Care Foundation',
    description:
      'Explore Biblical mentorship, Christian education, child protection, discipleship, human dignity, climate care, and refugee support.',
  },
  '/programs/care-school': {
    title: 'Care Nursery & Primary School | Creation Care Foundation',
    description:
      'Care Nursery and Primary School invests in children through safe, nurturing early childhood and primary education.',
  },
  '/team': {
    title: 'Team & Leadership | Creation Care Foundation',
    description:
      'Meet the servant-leadership structure and values guiding Creation Care Foundation.',
  },
  '/get-involved': {
    title: 'Get Involved | Creation Care Foundation',
    description:
      'Volunteer, mentor, partner, pray, or donate to support Creation Care Foundation’s mission.',
  },
  '/donate': {
    title: 'Donate | Creation Care Foundation',
    description:
      'Your giving helps mentor young people, protect children, support communities, and care for God’s creation.',
  },
  '/contact': {
    title: 'Contact Us | Creation Care Foundation',
    description:
      'Contact Creation Care Foundation in Kicukiro, Masaka, Kigali, Rwanda.',
  },
};

function Seo({ path }: { path: string }) {
  useEffect(() => {
    const meta = pageMeta[path] ?? pageMeta['/'];
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', meta.description);
  }, [path]);
  return null;
}

function accentBg(accent: string) {
  if (accent === 'sun') return 'bg-[#f2b857]';
  if (accent === 'blue') return 'bg-[#79b4c3]';
  if (accent === 'leaf') return 'bg-[#1d664d]';
  return 'bg-[#47c6b3]';
}

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 sm:gap-4" data-testid="link-brand">
      <img
        src={creationCareLogo}
        alt="Creation Care Foundation logo"
        className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
        data-testid="img-brand-mark"
      />
      <span className={`hidden leading-[.95] sm:block ${dark ? 'text-[#173d32]' : 'text-[#f7f3e8]'}`}>
        <span className={`block font-mono text-[9px] font-bold uppercase tracking-[.16em] ${dark ? 'text-[#1d664d]' : 'text-[#47c6b3]'}`}>
          Creation Care Foundation
        </span>
        <span className="mt-1 block max-w-[190px] text-[11px] font-bold uppercase tracking-[.06em]">
          Caring for people &amp; creation
        </span>
      </span>
    </Link>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const navColor = 'text-[#f7f3e8]/90 hover:text-[#f2b857]';

  return (
    <header className="absolute left-0 right-0 top-0 z-40 text-[#f7f3e8]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <BrandMark />
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring relative text-[10px] font-bold uppercase tracking-[.12em] transition-colors ${location === item.href || location.startsWith(`${item.href}/`) ? 'text-[#f2b857]' : navColor}`}
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
              {(location === item.href || location.startsWith(`${item.href}/`)) && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-[#f2b857]" aria-hidden="true" />
              )}
            </Link>
          ))}
          <Link
            href="/donate"
            className="focus-ring rounded-full bg-[#f2b857] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-transform hover:-translate-y-0.5"
            data-testid="link-nav-donate"
          >
            Donate
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="focus-ring rounded-full border border-[#f7f3e8]/30 p-3 text-[#f7f3e8] xl:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mx-4 rounded-2xl border border-[#47c6b3]/30 bg-[#173d32] p-5 shadow-xl xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="focus-ring border-b border-[#f7f3e8]/10 py-4 text-sm font-bold uppercase tracking-[.12em] text-[#f7f3e8]"
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
  return (
    <footer className="bg-[#173d32] py-12 text-[#f7f3e8]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-[320px] text-xs leading-relaxed text-[#f7f3e8]/55">
            A Christian organisation caring for God&apos;s creation, developing people, protecting children, and promoting human dignity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#f7f3e8]/65">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring transition-colors hover:text-[#47c6b3]"
              data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/donate" className="focus-ring text-[#f2b857]" data-testid="link-footer-donate">
            Donate
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] flex-col gap-2 border-t border-[#f7f3e8]/15 px-5 pt-5 font-mono text-[9px] uppercase tracking-[.16em] text-[#f7f3e8]/40 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>Creation Care Foundation · CCF</span>
        <span>Kicukiro, Masaka, Kigali</span>
      </div>
    </footer>
  );
}

function PageIntro({
  eyebrow,
  title,
  copy,
  image = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-[#173d32] pb-20 pt-32 text-[#f7f3e8] sm:pb-28 sm:pt-36 lg:pb-36">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-36 top-12 h-[600px] w-[600px] rounded-full border border-[#47c6b3]/20" />
      <div className="absolute -right-12 top-36 h-[420px] w-[420px] rounded-full border border-[#f2b857]/20" />
      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.55fr] lg:items-end lg:gap-20 lg:px-12">
        <div>
          <Reveal>
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#47c6b3]">
              <span className="h-px w-10 bg-[#47c6b3]" /> {eyebrow}
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <h1 className="max-w-[860px] font-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[.92] tracking-[-.05em] text-balance">
              {title}
            </h1>
          </Reveal>
          <Reveal className="delay-2">
            <p className="mt-8 max-w-[640px] text-base leading-relaxed text-[#f7f3e8]/68 sm:text-lg">{copy}</p>
          </Reveal>
        </div>
        {image && (
          <Reveal className="delay-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#f7f3e8]/25 bg-[#dce9e2] shadow-2xl">
              <img
                src={referenceImage}
                alt="Creation Care Foundation community"
                className="h-[220px] w-full object-cover object-top"
                data-testid="img-page-reference"
              />
              <div className="bg-[#f7f3e8] px-5 py-4 text-[#173d32]">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Christ-centered care</p>
                <p className="mt-1 text-sm font-semibold">People. Dignity. Creation.</p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">{children}</p>;
}

function Home() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/" />
      <SiteHeader />
      <section className="relative flex min-h-[720px] items-end overflow-hidden bg-[#173d32] pb-16 pt-32 text-[#f7f3e8] sm:min-h-[800px] sm:pb-24 sm:pt-36 lg:min-h-[860px] lg:pb-28" aria-labelledby="hero-title">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-32 top-20 h-[560px] w-[560px] rounded-full border border-[#47c6b3]/20 sm:right-[-90px] lg:top-14 lg:h-[720px] lg:w-[720px]" />
        <div className="absolute -right-16 top-36 h-[390px] w-[390px] rounded-full border border-[#f2b857]/20 sm:right-[-30px] lg:top-32 lg:h-[560px] lg:w-[560px]" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_380px] lg:items-end lg:gap-16 lg:px-12">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#47c6b3]">
                <span className="h-px w-10 bg-[#47c6b3]" /> Creation Care Foundation · CCF
              </div>
            </Reveal>
            <Reveal className="delay-1">
              <h1 id="hero-title" className="font-display text-[clamp(2.8rem,8vw,7.2rem)] leading-[.9] tracking-[-.05em] text-balance">
                Care for people.<br /><em className="font-normal text-[#47c6b3]">Care for creation.</em>
              </h1>
            </Reveal>
            <Reveal className="delay-2">
              <p className="mt-8 max-w-[580px] text-base leading-relaxed text-[#f7f3e8]/72 sm:text-lg">
                Creation Care Foundation is a Christian organisation committed to caring for God&apos;s creation, developing people, protecting children, promoting human dignity, and serving vulnerable communities.
              </p>
            </Reveal>
            <Reveal className="delay-3">
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/about" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#47c6b3] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32] transition-transform hover:-translate-y-1" data-testid="link-hero-about">
                  Discover our story <ArrowDown size={16} />
                </Link>
                <Link href="/donate" className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-colors hover:text-[#f2b857]" data-testid="link-hero-donate">
                  Give today <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="delay-2">
            <div className="relative mx-auto max-w-[380px]">
              <div className="overflow-hidden rounded-[2rem] border border-[#f7f3e8]/30 bg-[#f7f3e8] p-6 shadow-2xl shadow-[#0c241d]/30">
                <img src={creationCareLogo} alt="Creation Care Foundation logo" className="mx-auto h-auto w-full max-w-[260px] object-contain" data-testid="img-hero-logo" />
                <div className="mt-5 border-t border-[#173d32]/10 pt-4 text-center text-[#173d32]">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Our calling</p>
                  <p className="mt-2 text-sm font-semibold leading-snug">Love God. Love neighbours. Protect the vulnerable. Care for creation.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[#173d32]/10 bg-[#f2b857] py-5" aria-label="Organisation focus">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 sm:justify-between sm:px-8 lg:px-12">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]">Christ-centered · Child protection · Creation care</p>
          <Link href="/programs" className="focus-ring group flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]" data-testid="link-ribbon-programs">
            Explore our programs <MoveRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-20 sm:py-28 lg:py-36" aria-labelledby="home-belief-title">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-12">
          <Reveal>
            <SectionLabel>01 / What we believe</SectionLabel>
            <h2 id="home-belief-title" className="mt-6 max-w-[440px] font-display text-4xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Created by God. Called to care.
            </h2>
          </Reveal>
          <Reveal className="delay-1">
            <p className="text-[clamp(1.35rem,2.6vw,2.2rem)] leading-[1.2] tracking-[-.03em] text-[#173d32]">
              We believe that God is the Creator of all things, every person is created in God&apos;s image, and Christians are called to love God, love their neighbours, protect the vulnerable, and faithfully care for creation.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ['Vision', 'A Christ-centered world where people flourish, children are protected, human dignity is respected, and God’s creation is faithfully cared for.'],
                ['Mission', 'To mentor, disciple, educate, protect, and empower individuals and communities through Biblical principles.'],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-[1.5rem] border border-[#173d32]/12 bg-[#e4eee9] p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">{label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#173d32]/75">{copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e4eee9] py-20 sm:py-28" aria-labelledby="home-programs-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-[#173d32]/15 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>02 / Our programs</SectionLabel>
                <h2 id="home-programs-title" className="mt-4 max-w-[680px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
                  Discipleship, protection, and creation care — together.
                </h2>
              </div>
              <Link href="/programs" className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-all-programs">
                View all programs <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#173d32]/15 bg-[#173d32]/15 sm:grid-cols-2 lg:grid-cols-4">
            {programAreas.slice(0, 4).map((area, index) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.id} className={`delay-${Math.min(index + 1, 3)}`}>
                  <article className="group flex min-h-[300px] flex-col justify-between bg-[#f7f3e8] p-7 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]" data-testid={`card-home-program-${area.id}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.number}</span>
                      <div className={`rounded-full p-3 ${accentBg(area.accent)}`}><Icon size={20} className="text-[#173d32]" /></div>
                    </div>
                    <div>
                      <h3 className="max-w-[220px] font-display text-2xl leading-[1.05] tracking-[-.03em]">{area.title}</h3>
                      <p className="mt-4 text-sm leading-[1.65] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{area.copy}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f2b857] py-20 sm:py-28" aria-labelledby="home-cta-title">
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>03 / Call to action</SectionLabel>
            <h2 id="home-cta-title" className="mt-6 max-w-[880px] font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[.94] tracking-[-.045em] text-[#173d32]">
              Be part of God&apos;s work of caring for creation.
            </h2>
            <p className="mt-6 max-w-[560px] text-sm leading-relaxed text-[#173d32]/75 sm:text-base">
              Follow Christ. Mentor the next generation. Protect children. Uphold human dignity. Care for creation. Whether you pray, give, volunteer, mentor, partner, or serve — you can be part of the mission.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/get-involved" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-home-get-involved">
                Get involved <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#173d32]/25 px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-contact">
                Contact us <ArrowUpRight size={16} />
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/about" />
      <SiteHeader />
      <PageIntro
        eyebrow="About Us · Creation Care Foundation"
        title={<>A Christian organisation for people and creation.</>}
        copy="Creation Care Foundation (CCF) is committed to caring for God's creation, developing people, protecting children, promoting human dignity, and serving vulnerable communities."
        image
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Belief</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">Made in God&apos;s image.</h2>
            <p className="mt-6 text-base leading-[1.8] text-[#173d32]/7">
              We believe that God is the Creator of all things, every person is created in God&apos;s image, and Christians are called to love God, love their neighbours, protect the vulnerable, and faithfully care for creation.
            </p>
          </Reveal>
          <Reveal className="delay-1">
            <div className="grid gap-5">
              <article className="rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-10">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Our vision</p>
                <p className="mt-6 font-display text-3xl leading-[1.05] tracking-[-.03em] sm:text-4xl">
                  A Christ-centered world where people flourish, children are protected, human dignity is respected, and God&apos;s creation is faithfully cared for.
                </p>
              </article>
              <article className="rounded-[2rem] bg-[#f2b857] p-8 text-[#173d32] sm:p-10">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#173d32]/7">Our mission</p>
                <p className="mt-6 text-base leading-relaxed sm:text-lg">
                  To mentor, disciple, educate, protect, and empower individuals and communities through Biblical principles so that they can follow Christ, serve others, protect the vulnerable, and become faithful stewards of God&apos;s creation.
                </p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>02 / Our identity</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-6xl">
              Biblical discipleship and creation care belong together.
            </h2>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-[#173d32]/7">
              Creation Care Foundation holds a clear identity as a Christian organisation where Biblical discipleship, human development, child protection, and creation care are integrated — not treated as separate activities.
            </p>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Programs() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs" />
      <SiteHeader />
      <PageIntro
        eyebrow="Our Programs · Mentorship to creation care"
        title={<>Programs that form people and care for creation.</>}
        copy="From Biblical mentorship and Christian education to child protection, human dignity, climate action, and refugee support — our work is rooted in Christ."
      />
      <section className="bg-[#e4eee9] py-20 sm:py-28" aria-labelledby="programs-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Program index</SectionLabel>
            <h2 id="programs-title" className="mt-5 max-w-[700px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
              Practical action shaped by Biblical principles.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {programAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.id} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                  <article id={area.id} className="group min-h-[340px] scroll-mt-8 rounded-[2rem] border border-[#173d32]/12 bg-[#f7f3e8] p-8 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8] sm:p-10" data-testid={`card-program-${area.id}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.number}</span>
                      <div className={`rounded-full p-3 ${accentBg(area.accent)}`}><Icon size={22} className="text-[#173d32]" /></div>
                    </div>
                    <div className="mt-16">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.category}</p>
                      <h3 className="mt-3 max-w-[420px] font-display text-3xl leading-[.98] tracking-[-.03em] sm:text-4xl">{area.title}</h3>
                      <p className="mt-5 max-w-[480px] text-sm leading-[1.75] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{area.copy}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-12">
          <Reveal>
            <SectionLabel>02 / Care Nursery &amp; Primary School</SectionLabel>
            <h2 className="mt-5 max-w-[700px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-6xl">
              Investing in children. Building stronger communities.
            </h2>
            <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-[#f7f3e8]/65">
              Care Nursery and Primary School provides children with a strong foundation for lifelong learning, personal development, and responsible citizenship.
            </p>
          </Reveal>
          <Reveal className="delay-1">
            <Link href="/programs/care-school" className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-programs-school">
              Explore the school <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function CareSchool() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs/care-school" />
      <SiteHeader />
      <PageIntro
        eyebrow="Care Nursery & Primary School"
        title={<>Investing in children. Building stronger communities.</>}
        copy="Care Nursery and Primary School provides children with a strong foundation for lifelong learning, personal development, and responsible citizenship."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Our approach</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">Education that forms the whole child.</h2>
          </Reveal>
          <Reveal className="delay-1">
            <p className="text-base leading-[1.85] text-[#173d32]/7 sm:text-lg">
              Our education approach goes beyond academic achievement. We create a safe and nurturing environment where young children can develop knowledge, confidence, creativity, character, and practical skills. Through quality early childhood and primary education, we help children discover their potential and prepare them to participate positively in their families, communities, and wider society.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>02 / Why education matters</SectionLabel>
            <h2 className="mt-5 max-w-[700px] font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Strong foundations for learning and life.
            </h2>
            <p className="mt-5 max-w-[620px] text-sm leading-relaxed text-[#173d32]/7">
              The early years of a child&apos;s life are critical for building the foundations for future learning and development. By providing quality education from nursery through primary school, we have an opportunity to:
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schoolWhyPoints.map((point, index) => (
              <Reveal key={point} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <div className="h-full rounded-[1.5rem] border border-[#173d32]/12 bg-[#f7f3e8] p-6" data-testid={`card-school-why-${index + 1}`}>
                  <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[#1d664d]">0{index + 1}</span>
                  <p className="mt-4 text-sm leading-relaxed text-[#173d32]/75">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="delay-2">
            <div className="mt-12 rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12">
              <p className="max-w-[720px] text-base leading-relaxed text-[#f7f3e8]/75 sm:text-lg">
                Supporting Care Nursery and Primary School is an investment in children and in the future of the communities they will shape. Through partnerships and support, we can strengthen learning resources, improve educational facilities, equip teachers, expand learning opportunities, and ensure that more children have access to a safe and enriching educational environment.
              </p>
              <p className="mt-6 font-display text-3xl leading-tight tracking-[-.03em] sm:text-4xl">
                Together, we can give children the opportunity to learn, grow, and build a better future.
              </p>
              <Link href="/donate" className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-school-donate">
                Support the school <ArrowRight size={16} />
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/team" />
      <SiteHeader />
      <PageIntro
        eyebrow="Team & Leadership · Servant leadership"
        title={<>Serving God through servant leadership.</>}
        copy="Creation Care Foundation is led by a team of Christians committed to serving God, people, and creation."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Leadership roles</SectionLabel>
            <h2 className="mt-5 max-w-[640px] font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              A team structured for faithful service.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamRoles.map((role, index) => (
              <Reveal key={role.title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] p-7" data-testid={`card-team-${index + 1}`}>
                  <div>
                    <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[#1d664d]">0{index + 1}</span>
                    <h3 className="mt-5 font-display text-2xl leading-[1.05] text-[#173d32]">{role.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#173d32]/7">{role.copy}</p>
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
            <SectionLabel>02 / Our team values</SectionLabel>
            <h2 className="mt-5 max-w-[640px] font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              What guides how we serve.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamValues.map(([title, copy], index) => (
              <Reveal key={title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <div className="border-t-2 border-[#47c6b3] pt-5" data-testid={`card-value-${title.toLowerCase()}`}>
                  <h3 className="font-display text-2xl text-[#173d32]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#173d32]/7">{copy}</p>
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/get-involved" />
      <SiteHeader />
      <PageIntro
        eyebrow="Get Involved · Pray, serve, give"
        title={<>Be part of the mission.</>}
        copy="Whether you pray, give, volunteer, mentor, partner, or serve, you can help mentor the next generation, protect children, uphold dignity, and care for creation."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Ways to take part</SectionLabel>
            <h2 className="mt-5 max-w-[640px] font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              There is a place for you.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getInvolvedWays.map((way, index) => (
              <Reveal key={way.title} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] p-7" data-testid={`card-involve-${way.title.toLowerCase().replaceAll(' ', '-')}`}>
                  <div>
                    <HandHeart className="text-[#1d664d]" size={24} />
                    <h3 className="mt-6 font-display text-3xl leading-none text-[#173d32]">{way.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#173d32]/7">{way.copy}</p>
                  </div>
                  <Link href={way.href} className="focus-ring mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]" data-testid={`link-involve-${way.title.toLowerCase().replaceAll(' ', '-')}`}>
                    {way.title === 'Donate' ? 'Give today' : 'Start here'} <ChevronRight size={14} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>02 / Partner with us</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-6xl">
              Lasting change happens when people work together.
            </h2>
            <p className="mt-6 max-w-[560px] text-sm leading-relaxed text-[#f7f3e8]/65">
              We welcome partnerships with churches, schools, organisations, communities, mentors, and donors.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {partnerTypes.map((item) => (
              <span key={item} className="rounded-full border border-[#f7f3e8]/2 px-4 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#f7f3e8]/8">
                {item}
              </span>
            ))}
          </div>
          <Link href="/contact" className="focus-ring mt-10 inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-involve-partner">
            Become a partner <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function DonationForm() {
  const [amount, setAmount] = useState('25');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [focus, setFocus] = useState('where-needed');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim() && email.trim() && Number(amount) > 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[540px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-donation-success">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]"><Check size={27} /></div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Thank you for your generosity</p>
          <h2 className="mt-5 max-w-[500px] font-display text-4xl leading-[.92] sm:text-5xl">Your gift can help transform lives.</h2>
          <p className="mt-6 max-w-[440px] text-sm leading-relaxed text-[#f7f3e8]/65">
            We&apos;ve recorded your interest in a {frequency} contribution of ${Number(amount).toFixed(2)}. The Creation Care team will contact you at {email} to confirm the best way to complete it.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href={`mailto:${CONTACT_EMAIL}`} className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-donation-email">Email Creation Care <Mail size={15} /></a>
          <button type="button" onClick={() => setSubmitted(false)} className="focus-ring inline-flex items-center gap-2 border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.14em] text-[#47c6b3]" data-testid="button-donation-again">Make another donation</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitDonation} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-donation">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Give today</p>
          <p className="mt-2 text-sm text-[#173d32]/60">Partner with us through your generosity.</p>
        </div>
        <HeartHandshake size={24} className="text-[#1d664d]" />
      </div>
      <fieldset className="mt-8">
        <legend className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Choose an amount</legend>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['10', '25', '50', '100', '250', '500'].map((value) => (
            <button key={value} type="button" onClick={() => setAmount(value)} className={`focus-ring rounded-xl border py-3 text-sm font-bold transition-colors ${amount === value ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`} data-testid={`button-donation-amount-${value}`}>${value}</button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Custom donation amount in US dollars</span>
          <div className="flex items-center rounded-xl border border-[#173d32]/15 bg-[#f7f3e8] px-4">
            <span className="text-sm font-bold text-[#173d32]/45">$</span>
            <input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} className="focus-ring w-full bg-transparent px-2 py-3 text-sm text-[#173d32] outline-none" placeholder="Custom amount" data-testid="input-donation-amount" />
          </div>
        </label>
      </fieldset>
      <fieldset className="mt-8">
        <legend className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">How often?</legend>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ['once', 'One time'],
            ['monthly', 'Monthly'],
          ].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFrequency(value as 'once' | 'monthly')} className={`focus-ring rounded-xl border py-3 text-sm font-bold transition-colors ${frequency === value ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`} data-testid={`button-donation-frequency-${value}`}>{label}</button>
          ))}
        </div>
      </fieldset>
      <label className="mt-8 block">
        <span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Where should your support go?</span>
        <select value={focus} onChange={(event) => setFocus(event.target.value)} className="focus-ring mt-3 w-full rounded-xl border border-[#173d32]/15 bg-[#f7f3e8] px-4 py-3 text-sm text-[#173d32] outline-none" data-testid="select-donation-focus">
          <option value="where-needed">Where it is needed most</option>
          <option value="mentorship">Biblical mentorship</option>
          <option value="education">Christian education &amp; discipleship</option>
          <option value="protection">Child protection</option>
          <option value="climate">Climate &amp; creation care</option>
          <option value="school">Care Nursery &amp; Primary School</option>
        </select>
      </label>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Your name</span><input value={name} onChange={(event) => setName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Full name" data-testid="input-donation-name" /></label>
        <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@example.org" data-testid="input-donation-email" /></label>
      </div>
      <button type="submit" className="focus-ring mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-donation">Donate Now · ${Number(amount) > 0 ? Number(amount).toFixed(2) : '0.00'} <ArrowRight size={16} /></button>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#173d32]/55">This form starts your donation request. The Creation Care team will contact you to confirm payment details securely.</p>
    </form>
  );
}

function Donate() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/donate" />
      <SiteHeader />
      <PageIntro
        eyebrow="Donate · Your giving can help transform lives"
        title={<>Partner with us through your generosity.</>}
        copy="Your generosity helps Creation Care Foundation mentor young people, protect children, support communities, provide Christian education, develop leaders, promote human dignity, and care for God's creation."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Why give</SectionLabel>
            <h2 className="mt-5 max-w-[430px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">Every gift builds a more compassionate generation.</h2>
            <p className="mt-6 text-sm leading-relaxed text-[#173d32]/7">Your donation can support:</p>
            <ul className="mt-5 space-y-3">
              {donationSupports.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#173d32]/75">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#47c6b3]" />
                  {item}
                </li>
              ))}
            </ul>
            <blockquote className="mt-10 border-l-2 border-[#47c6b3] pl-5 text-sm italic leading-relaxed text-[#173d32]/75">
              “Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”
            </blockquote>
            <div className="mt-8 rounded-2xl bg-[#f2b857] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]/7">Our commitment to stewardship</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/75">
                We are committed to handling donations responsibly, transparently, and faithfully — using every resource entrusted to us to advance our mission.
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
  const [sent, setSent] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formName.trim() && formEmail.trim() && formMessage.trim()) setSent(true);
  };

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/contact" />
      <SiteHeader />
      <PageIntro
        eyebrow="Contact Us · We would love to hear from you"
        title={<>Let&apos;s connect.</>}
        copy="Whether you want to volunteer, become a mentor, partner with us, support a project, invite us to your church or community, or simply learn more about our work — we would love to connect with you."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28 lg:py-36" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Contact information</SectionLabel>
            <h2 id="contact-title" className="mt-5 max-w-[480px] font-display text-5xl leading-[.92] tracking-[-.045em] text-[#173d32] sm:text-6xl">
              Creation Care Foundation
            </h2>
            <div className="mt-10 space-y-4 border-t border-[#173d32]/15 pt-6 text-sm text-[#173d32]/75">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#1d664d]" /> {CONTACT_ADDRESS}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-email"><Mail size={16} className="text-[#1d664d]" /> {CONTACT_EMAIL}</a>
              <a href="tel:+250788557229" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone"><Phone size={16} className="text-[#1d664d]" /> {CONTACT_PHONE_PRIMARY}</a>
              <a href="tel:+250788423418" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone-2"><Phone size={16} className="text-[#1d664d]" /> {CONTACT_PHONE_SECONDARY}</a>
            </div>
            <div className="mt-10 rounded-2xl bg-[#e4eee9] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">Partner invitation</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/7">
                Together, we can mentor the next generation, protect children, strengthen communities, uphold human dignity, and care for God&apos;s creation.
              </p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            {sent ? (
              <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-contact-success">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]"><Check size={26} /></div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Message received</p>
                  <h3 className="mt-5 max-w-[420px] font-display text-4xl leading-[.92] sm:text-5xl">Thank you, {formName.split(' ')[0]}.</h3>
                  <p className="mt-5 max-w-[380px] text-sm leading-relaxed text-[#f7f3e8]/65">Your note is ready for the Creation Care team. We look forward to connecting with you.</p>
                </div>
                <button type="button" onClick={() => setSent(false)} className="focus-ring self-start border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.15em] text-[#47c6b3]" data-testid="button-send-another">Send another message</button>
              </div>
            ) : (
              <form onSubmit={submitForm} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-contact">
                <div className="mb-8 flex items-center justify-between">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Send us a message</p>
                  <BookOpen className="text-[#1d664d]" size={20} />
                </div>
                <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Name</span><input value={formName} onChange={(event) => setFormName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Your full name" data-testid="input-contact-name" /></label>
                <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email</span><input value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@example.org" data-testid="input-contact-email" /></label>
                <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Phone</span><input value={formPhone} onChange={(event) => setFormPhone(event.target.value)} name="phone" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Optional" data-testid="input-contact-phone" /></label>
                <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Subject</span><input value={formSubject} onChange={(event) => setFormSubject(event.target.value)} name="subject" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Volunteer, partnership, prayer..." data-testid="input-contact-subject" /></label>
                <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Message</span><textarea value={formMessage} onChange={(event) => setFormMessage(event.target.value)} required name="message" rows={4} className="focus-ring mt-3 w-full resize-none border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="How can we walk with you?" data-testid="input-contact-message" /></label>
                <button type="submit" className="focus-ring mt-9 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-contact">Send message <MoveRight size={16} /></button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
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
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/programs" component={Programs} />
      <Route path="/programs/care-school" component={CareSchool} />
      <Route path="/team" component={Team} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/donate" component={Donate} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

  return (
    <WouterRouter base={base}>
      <AppRouter />
    </WouterRouter>
  );
}

export default App;
