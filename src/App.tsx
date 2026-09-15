import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MoveRight,
  Phone,
  Scale,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import referenceImage from '@/assets/ydhra-reference.png';
import ydhraLogo from '@/assets/ydhra-logo.png';
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

const navItems = [
  { label: 'About us', href: '/about' },
  { label: 'Programmes', href: '/programs' },
  { label: 'Impact', href: '/impact' },
  { label: 'Stories', href: '/stories' },
  { label: 'Contact', href: '/contact' },
];

const focusAreas = [
  {
    number: '01',
    icon: Sprout,
    title: 'Livelihoods with agency',
    shortTitle: 'Economic empowerment',
    copy: 'Financial literacy, savings, investments and micro-entrepreneurship mentoring that puts practical choices, income and dignity within reach.',
    accent: 'teal',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'A culture that reads',
    shortTitle: 'Reading & learning',
    copy: 'Book and reading festivals, regional and international learning trips, and spaces where a curious mind can keep getting bigger.',
    accent: 'sun',
  },
  {
    number: '03',
    icon: HeartHandshake,
    title: 'Stronger together',
    shortTitle: 'Partnerships',
    copy: 'Relationships with organisations that share our values, helping young people build skills and aptitude for the betterment of their communities.',
    accent: 'blue',
  },
  {
    number: '04',
    icon: Scale,
    title: 'Wellbeing as a right',
    shortTitle: 'Community wellbeing',
    copy: 'Nutrition awareness, sanitation and shelter advocacy that treats safety and dignity as foundations for every other kind of progress.',
    accent: 'leaf',
  },
];

const programmeAreas = [
  {
    id: 'protect-human-rights',
    number: '01',
    icon: Scale,
    category: 'Rights & governance',
    title: 'Protect Human Rights and Governance',
    copy: 'We promote access to effective remedies and accountable institutions. Efficient justice systems hold individuals and state officials accountable while setting clear standards of behaviour under national legal frameworks.',
    accent: 'teal',
  },
  {
    id: 'children-protection',
    number: '02',
    icon: HeartHandshake,
    category: 'Child protection',
    title: 'Children Protection',
    copy: 'We work to keep children safe, reduce vulnerability and prevent further harm by addressing risk factors and unmet needs. Our focus includes children’s welfare, health, development and emotional security.',
    accent: 'sun',
  },
  {
    id: 'sustainable-development',
    number: '03',
    icon: Sprout,
    category: 'Sustainable development',
    title: 'Promote Sustainable Development',
    copy: 'We support social progress and equality, environmental protection, conservation of natural resources and stable economic growth so prosperity can serve both present and future generations.',
    accent: 'blue',
  },
  {
    id: 'youth-women-empowerment',
    number: '04',
    icon: Users,
    category: 'Empowerment',
    title: 'Youth and Women Empowerment',
    copy: 'We help young people and women confront their circumstances with confidence, resources and life skills. The journey strengthens independence, resilience and self-determination.',
    accent: 'leaf',
  },
  {
    id: 'climate-change',
    number: '05',
    icon: Scale,
    category: 'Climate action',
    title: 'Climate Change',
    copy: 'We raise awareness of the relationship between people and the environment, including the effects of deforestation, pollution, population growth and technological expansion.',
    accent: 'teal',
  },
  {
    id: 'agriculture',
    number: '06',
    icon: Sprout,
    category: 'Food & livelihoods',
    title: 'Agriculture',
    copy: 'Our garden and urban farming training gives participants hands-on techniques and expert guidance to grow food sustainably, whether they are starting a backyard garden or farming in a city.',
    accent: 'sun',
  },
  {
    id: 'youth-mentorship',
    number: '07',
    icon: Users,
    category: 'Mentorship',
    title: 'Youth Mentorship',
    copy: 'We equip established and emerging ministries, churches and nonprofits to design safe, effective and sustainable mentoring programmes for youth, families and adults in their communities.',
    accent: 'blue',
  },
];

const donationFaqs = [
  ['How will my support be used?', 'You can direct your contribution toward a focus area or choose where it is needed most. The YDHRA team will confirm the details with you before payment.'],
  ['Can I make a monthly contribution?', 'Yes. Choose Monthly in the donation form and the team will help you set up a recurring contribution securely.'],
  ['Can I support a programme with my time or expertise?', 'Absolutely. Financial support is one way to help; mentorship, programme partnerships, learning resources and professional expertise are also valuable.'],
];

const impactSignals = [
  {
    number: '01',
    title: 'Voice',
    copy: 'People understand their rights, ask better questions and take part in the decisions that affect their lives.',
    icon: Scale,
    accent: 'teal',
  },
  {
    number: '02',
    title: 'Capability',
    copy: 'Knowledge becomes practical when it can support a livelihood, a learning journey, a safer home or a new confidence.',
    icon: Sprout,
    accent: 'sun',
  },
  {
    number: '03',
    title: 'Connection',
    copy: 'Partnerships turn isolated effort into shared momentum between communities, organisations and institutions.',
    icon: HeartHandshake,
    accent: 'blue',
  },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'YDHRA | Human rights in motion',
    description:
      'Youth for Development and Human Rights Advancement promotes human rights and development among youth and women in Rwanda.',
  },
  '/about': {
    title: 'About YDHRA | Our mission, vision and story',
    description:
      'Learn about YDHRA, a Rwandan organisation founded in 2015 to advance human rights and development among youth and women.',
  },
  '/programs': {
    title: 'What we do | YDHRA programmes',
    description:
      'Explore YDHRA programmes in financial literacy, reading culture, partnerships, nutrition, sanitation and shelter.',
  },
  '/stories': {
    title: 'Stories | YDHRA',
    description:
      'See the ideas, learning and community relationships that keep YDHRA moving human rights and development forward.',
  },
  '/impact': {
    title: 'Impact | How YDHRA works',
    description:
      'Discover how YDHRA turns human rights, learning, connection and practical support into lasting community progress.',
  },
  '/donate': {
    title: 'Donate | Support YDHRA',
    description:
      'Support YDHRA programmes for youth and women in Rwanda with a one-time or monthly contribution.',
  },
  '/contact': {
    title: 'Contact YDHRA | Start a conversation',
    description:
      'Connect with Youth for Development and Human Rights Advancement in Kigali, Rwanda.',
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

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 sm:gap-4" data-testid="link-brand">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f7f3e8] shadow-sm sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <img
          src={ydhraLogo}
          alt="Creation Care logo"
          className="h-full w-full scale-110 object-contain"
          data-testid="img-brand-mark"
        />
      </span>
      <span className={`hidden leading-[.95] sm:block ${dark ? 'text-[#173d32]' : 'text-[#f7f3e8]'}`}>
        <span className={`block font-mono text-[10px] font-bold uppercase tracking-[.16em] ${dark ? 'text-[#1d664d]' : 'text-[#47c6b3]'}`}>
          YDHRA / Rwanda
        </span>
        <span className="mt-1.5 block max-w-[200px] text-xs font-bold uppercase tracking-[.06em] sm:text-[13px]">
          Youth for Development &amp; Human Rights Advancement
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
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
        <BrandMark />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring relative text-[11px] font-bold uppercase tracking-[.14em] transition-colors ${location === item.href ? 'text-[#f2b857]' : navColor}`}
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
              {location === item.href && <span className="absolute -bottom-2 left-0 h-px w-full bg-[#f2b857]" aria-hidden="true" />}
            </Link>
          ))}
          <Link
            href="/donate"
            className="focus-ring rounded-full bg-[#f2b857] px-5 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-transform hover:-translate-y-0.5"
            data-testid="link-nav-donate"
          >
            Donate
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="focus-ring rounded-full border border-[#f7f3e8]/30 p-3 text-[#f7f3e8] lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mx-4 rounded-2xl border border-[#47c6b3]/30 bg-[#173d32] p-5 shadow-xl lg:hidden">
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
              Donate to YDHRA
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
          <p className="mt-6 max-w-[280px] text-xs leading-relaxed text-[#f7f3e8]/55">
            For every young person with a question. For every woman building a way forward.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[.16em] text-[#f7f3e8]/65">
          {navItems.slice(0, 4).map((item) => (
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
          <a href="#top" className="focus-ring flex items-center gap-2 text-[#f2b857]" data-testid="link-back-top">
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] justify-between border-t border-[#f7f3e8]/15 px-5 pt-5 font-mono text-[9px] uppercase tracking-[.16em] text-[#f7f3e8]/40 sm:px-8 lg:px-12">
        <span>YDHRA / Rwanda</span>
        <span>Human rights in motion</span>
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
    <section className="relative overflow-hidden bg-[#173d32] pb-24 pt-36 text-[#f7f3e8] sm:pb-32 lg:pb-40">
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
            <h1 className="max-w-[840px] font-display text-[clamp(3.2rem,8vw,7.4rem)] leading-[.9] tracking-[-.055em] text-balance">
              {title}
            </h1>
          </Reveal>
          <Reveal className="delay-2">
            <p className="mt-8 max-w-[620px] text-lg leading-relaxed text-[#f7f3e8]/68 sm:text-xl">{copy}</p>
          </Reveal>
        </div>
        {image && (
          <Reveal className="delay-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#f7f3e8]/25 bg-[#dce9e2] shadow-2xl">
              <img
                src={referenceImage}
                alt="YDHRA community organisation reference"
                className="h-[220px] w-full object-cover object-top"
                data-testid="img-page-reference"
              />
              <div className="bg-[#f7f3e8] px-5 py-4 text-[#173d32]">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Since 2015</p>
                <p className="mt-1 text-sm font-semibold">Rooted in people. Open to possibility.</p>
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
      <section className="relative flex min-h-[760px] items-end overflow-hidden bg-[#173d32] pb-20 pt-36 text-[#f7f3e8] sm:min-h-[820px] sm:pb-28 lg:min-h-[880px] lg:pb-32" aria-labelledby="hero-title">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-32 top-20 h-[560px] w-[560px] rounded-full border border-[#47c6b3]/20 sm:right-[-90px] lg:top-14 lg:h-[720px] lg:w-[720px]" />
        <div className="absolute -right-16 top-36 h-[390px] w-[390px] rounded-full border border-[#f2b857]/20 sm:right-[-30px] lg:top-32 lg:h-[560px] lg:w-[560px]" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_410px] lg:items-end lg:gap-20 lg:px-12">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#47c6b3]">
                <span className="h-px w-10 bg-[#47c6b3]" /> Since 2015 · Kigali, Rwanda
              </div>
            </Reveal>
            <Reveal className="delay-1">
              <h1 id="hero-title" className="font-display text-[clamp(3.5rem,9vw,8.6rem)] leading-[.88] tracking-[-.055em] text-balance">
                The future<br /><em className="font-normal text-[#47c6b3]">belongs</em> to all of us.
              </h1>
            </Reveal>
            <Reveal className="delay-2">
              <p className="mt-9 max-w-[570px] text-lg leading-relaxed text-[#f7f3e8]/72 sm:text-xl">
                YDHRA works with young people and women in Rwanda to turn human rights into lived experience — through opportunity, learning and community care.
              </p>
            </Reveal>
            <Reveal className="delay-3">
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link href="/about" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#47c6b3] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32] transition-transform hover:-translate-y-1" data-testid="link-hero-about">
                  Discover our story <ArrowDown size={16} />
                </Link>
                <Link href="/donate" className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-colors hover:text-[#f2b857]" data-testid="link-hero-donate">
                  Make a difference <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="delay-2">
            <div className="relative ml-auto max-w-[410px]">
              <div className="absolute -left-5 -top-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2b857] text-[#173d32]">
                <ArrowUpRight size={22} />
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-[#f7f3e8]/30 bg-[#dce9e2] shadow-2xl shadow-[#0c241d]/30">
                <img src={referenceImage} alt="YDHRA community identity and organisation page" className="h-[270px] w-full object-cover object-top sm:h-[315px]" data-testid="img-brand-reference" />
                <div className="flex items-center justify-between bg-[#f7f3e8] px-5 py-4 text-[#173d32]">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Our identity</p>
                    <p className="mt-1 text-sm font-semibold">Rooted in people. Open to possibility.</p>
                  </div>
                  <span className="font-display text-3xl text-[#47c6b3]">01</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[#173d32]/10 bg-[#f2b857] py-5" aria-label="Organisation facts">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 sm:justify-between sm:px-8 lg:px-12">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]">Human rights · Development · Dignity</p>
          <div className="hidden h-5 w-px bg-[#173d32]/25 sm:block" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]">A society where justice is lived</p>
          <Link href="/programs" className="focus-ring group flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]" data-testid="link-ribbon-programs">
            Explore our work <MoveRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-24 sm:py-32 lg:py-40" aria-labelledby="home-story-title">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-28 lg:px-12">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-5 -top-6 font-display text-[9rem] leading-none text-[#dce9e2] sm:text-[12rem]">R</div>
              <div className="relative border-l-2 border-[#47c6b3] pl-6 sm:pl-9">
                <SectionLabel>01 / Our story</SectionLabel>
                <h2 id="home-story-title" className="mt-7 max-w-[440px] font-display text-5xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-6xl">
                  Development starts when people are seen.
                </h2>
              </div>
              <div className="mt-14 flex items-end gap-5">
                <span className="font-display text-8xl leading-none text-[#1d664d]">2015</span>
                <span className="mb-2 max-w-[125px] text-xs leading-relaxed text-[#173d32]/60">The year YDHRA began creating room for rights, ideas and action.</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <div className="max-w-[640px]">
              <p className="text-[clamp(1.55rem,3vw,2.65rem)] leading-[1.15] tracking-[-.035em] text-[#173d32]">
                Youth for Development and Human Rights Advancement exists to make a simple promise practical: every young person and woman deserves the power to shape what comes next.
              </p>
              <p className="mt-8 max-w-[550px] text-base leading-[1.85] text-[#173d32]/65">
                We are a Rwandan organisation grounded in human rights and social development. We listen first, then build with communities — connecting everyday needs to the skills, relationships and confidence that make change durable.
              </p>
              <Link href="/about" className="focus-ring mt-10 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="link-home-about">
                Read more about YDHRA <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e4eee9] py-24 sm:py-32" aria-labelledby="home-focus-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-7 border-b border-[#173d32]/15 pb-9 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>02 / What we do</SectionLabel>
                <h2 id="home-focus-title" className="mt-4 max-w-[650px] font-display text-5xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-7xl">A bigger future is built in small, brave steps.</h2>
              </div>
              <p className="max-w-[250px] text-sm leading-relaxed text-[#173d32]/65">Four connected priorities. One belief: rights become real when people have the tools to claim them.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[#173d32]/15 bg-[#173d32]/15 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.number} className={`delay-${Math.min(index + 1, 3)}`}>
                  <article className="group flex min-h-[330px] flex-col justify-between bg-[#f7f3e8] p-7 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8] sm:p-8" data-testid={`card-focus-${area.number}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.number}</span>
                      <div className={`rounded-full p-3 ${area.accent === 'sun' ? 'bg-[#f2b857]' : area.accent === 'blue' ? 'bg-[#79b4c3]' : 'bg-[#47c6b3]'}`}><Icon size={21} className="text-[#173d32]" /></div>
                    </div>
                    <div>
                      <h3 className="max-w-[230px] font-display text-3xl leading-[.98] tracking-[-.03em]">{area.title}</h3>
                      <p className="mt-5 text-sm leading-[1.65] text-[#173d32]/65 transition-colors group-hover:text-[#f7f3e8]/65">{area.copy}</p>
                      <Link href="/programs" className="focus-ring mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d] group-hover:text-[#47c6b3]" data-testid={`link-focus-${area.number}`}>View programme <ChevronRight size={14} /></Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f2b857] py-24 sm:py-32" aria-labelledby="home-vision-title">
        <div className="absolute -right-14 -top-24 font-display text-[25rem] leading-none text-[#e6a443]/40">"</div>
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>03 / The vision</SectionLabel>
            <h2 id="home-vision-title" className="mt-8 max-w-[930px] font-display text-[clamp(2.8rem,6vw,6.4rem)] leading-[.92] tracking-[-.05em] text-[#173d32]">A society where human rights and justice in social development are not aspirations — they are the way things work.</h2>
          </Reveal>
          <Reveal className="delay-1">
            <div className="mt-14 flex flex-col justify-between gap-8 border-t border-[#173d32]/25 pt-6 sm:flex-row sm:items-end">
              <p className="max-w-[360px] text-sm leading-relaxed text-[#173d32]/70">This is the horizon we work toward, alongside young people, women and communities across Rwanda.</p>
              <Link href="/donate" className="focus-ring group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-[#173d32]" data-testid="link-vision-donate">Help move the horizon <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
            </div>
          </Reveal>
        </div>
      </section>
      <HomeCta />
      <SiteFooter />
    </main>
  );
}

function HomeCta() {
  return (
    <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="home-cta-title">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
        <Reveal>
          <div className="rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12">
            <SectionLabel>04 / Take part</SectionLabel>
            <h2 id="home-cta-title" className="mt-6 max-w-[580px] font-display text-5xl leading-[.92] tracking-[-.04em] sm:text-7xl">A little support can open a lot of doors.</h2>
            <p className="mt-6 max-w-[450px] text-base leading-relaxed text-[#f7f3e8]/65">Support a programme, share your expertise, or start a conversation with the people making change possible.</p>
            <Link href="/donate" className="focus-ring mt-9 inline-flex items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32] transition-transform hover:-translate-y-1" data-testid="link-home-cta-donate">Donate to YDHRA <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
        <Reveal className="delay-1">
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-8 sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]"><Users size={25} /></div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Partnerships begin here</p>
              <p className="mt-5 max-w-[320px] font-display text-4xl leading-[.96] text-[#173d32]">Bring your good idea.</p>
              <Link href="/contact" className="focus-ring mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-cta-contact">Start a conversation <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/about" />
      <SiteHeader />
      <PageIntro
        eyebrow="About YDHRA · Kigali, Rwanda"
        title={<>Human rights become real when people have a voice.</>}
        copy="Founded in 2015, Youth for Development and Human Rights Advancement is a local non-governmental organisation creating room for young people and women to lead, learn and shape the development of their country."
        image
      />
      <section className="bg-[#f7f3e8] py-24 sm:py-32 lg:py-40">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Our organisation</SectionLabel>
            <h2 className="mt-6 max-w-[440px] font-display text-5xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-6xl">A local organisation with a wide horizon.</h2>
          </Reveal>
          <Reveal className="delay-1">
            <div className="max-w-[680px]">
              <p className="text-[clamp(1.55rem,3vw,2.6rem)] leading-[1.12] tracking-[-.035em] text-[#173d32]">We empower people with a powerful voice, practical knowledge and resources that create changed lives.</p>
              <p className="mt-8 text-base leading-[1.85] text-[#173d32]/65">YDHRA focuses on the connection between human rights and development. When people know their rights and have the tools to act on them, families and communities can build fairer, healthier and more resilient futures.</p>
              <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#173d32]/10 bg-[#173d32]/10 sm:grid-cols-3">
                <div className="bg-[#e4eee9] p-6"><p className="font-display text-4xl text-[#1d664d]">2015</p><p className="mt-2 text-xs leading-relaxed text-[#173d32]/60">Founded in Rwanda</p></div>
                <div className="bg-[#e4eee9] p-6"><p className="font-display text-4xl text-[#1d664d]">Youth</p><p className="mt-2 text-xs leading-relaxed text-[#173d32]/60">At the centre of change</p></div>
                <div className="bg-[#e4eee9] p-6"><p className="font-display text-4xl text-[#1d664d]">Women</p><p className="mt-2 text-xs leading-relaxed text-[#173d32]/60">Partners in progress</p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-24 sm:py-32" aria-labelledby="mission-title">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <article className="h-full rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">02 / Our mission</span>
              <h2 id="mission-title" className="mt-12 max-w-[470px] font-display text-5xl leading-[.92] tracking-[-.04em] sm:text-6xl">Equip people to participate in their own future.</h2>
              <p className="mt-8 max-w-[500px] text-base leading-relaxed text-[#f7f3e8]/65">The mission of YDHRA is to promote human rights and development of youth and women; empowering them with life skills for active participation in the development of their country.</p>
            </article>
          </Reveal>
          <Reveal className="delay-1">
            <article className="h-full rounded-[2rem] bg-[#f2b857] p-8 text-[#173d32] sm:p-12">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#173d32]/70">03 / Our vision</span>
              <h2 className="mt-12 max-w-[470px] font-display text-5xl leading-[.92] tracking-[-.04em] sm:text-6xl">A society where justice is lived.</h2>
              <p className="mt-8 max-w-[500px] text-base leading-relaxed text-[#173d32]/70">A society in which Human Rights and Justice in Social Development system is realized — not only discussed, but experienced in everyday life.</p>
            </article>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-24 sm:py-32" aria-labelledby="values-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>04 / What guides us</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-8 border-b border-[#173d32]/15 pb-10 sm:flex-row sm:items-end">
              <h2 id="values-title" className="max-w-[650px] font-display text-5xl leading-[.93] tracking-[-.04em] text-[#173d32] sm:text-7xl">Build with people, not around them.</h2>
              <p className="max-w-[280px] text-sm leading-relaxed text-[#173d32]/65">Our work is grounded in participation, dignity, curiosity and the belief that lasting change is shared work.</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              ['01', 'Listen deeply', 'Lived experience is knowledge. We begin by making space for it.'],
              ['02', 'Make it useful', 'A right becomes stronger when people can use the knowledge behind it.'],
              ['03', 'Keep the door open', 'Every partnership, question and new idea can widen what is possible.'],
            ].map(([number, title, copy], index) => (
              <Reveal key={number} className={`delay-${index + 1}`}>
                <div className="border-t-2 border-[#47c6b3] pt-5" data-testid={`card-value-${number}`}>
                  <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d]">{number}</span>
                  <h3 className="mt-8 font-display text-3xl leading-none text-[#173d32]">{title}</h3>
                  <p className="mt-4 text-sm leading-[1.7] text-[#173d32]/65">{copy}</p>
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

function Programs() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs" />
      <SiteHeader />
      <PageIntro
        eyebrow="Programmes · Rights, growth & care"
        title={<>Seven ways to turn possibility into progress.</>}
        copy="Our programmes protect rights, strengthen communities and equip people with the knowledge and relationships needed to shape a more sustainable future."
      />
      <section className="bg-[#e4eee9] py-24 sm:py-32" aria-labelledby="programmes-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Programme index</SectionLabel>
            <div className="mt-5 flex flex-col justify-between gap-8 border-b border-[#173d32]/15 pb-10 lg:flex-row lg:items-end">
              <h2 id="programmes-title" className="max-w-[700px] font-display text-5xl leading-[.93] tracking-[-.04em] text-[#173d32] sm:text-7xl">Practical action for a more just future.</h2>
              <p className="max-w-[290px] text-sm leading-relaxed text-[#173d32]/65">Jump to a programme, then get involved with the team behind it.</p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <nav className="mt-8 flex gap-3 overflow-x-auto pb-3" aria-label="Programme navigation">
              {programmeAreas.map((area) => (
                <a
                  key={area.id}
                  href={`#${area.id}`}
                  className="focus-ring shrink-0 rounded-full border border-[#173d32]/20 bg-[#f7f3e8] px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-colors hover:border-[#173d32] hover:bg-[#173d32] hover:text-[#f7f3e8]"
                  data-testid={`link-programme-nav-${area.id}`}
                >
                  {area.category}
                </a>
              ))}
            </nav>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {programmeAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.id} className={`delay-${Math.min((index % 3) + 1, 3)}`}>
                  <article id={area.id} className="group min-h-[380px] scroll-mt-8 rounded-[2rem] border border-[#173d32]/12 bg-[#f7f3e8] p-8 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8] sm:p-10" data-testid={`card-program-${area.id}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.number}</span>
                      <div className={`rounded-full p-3 ${area.accent === 'sun' ? 'bg-[#f2b857]' : area.accent === 'blue' ? 'bg-[#79b4c3]' : 'bg-[#47c6b3]'}`}><Icon size={23} className="text-[#173d32]" /></div>
                    </div>
                    <div className="mt-24">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#1d664d] group-hover:text-[#47c6b3]">{area.category}</p>
                      <h3 className="mt-3 max-w-[420px] font-display text-4xl leading-[.95] tracking-[-.035em]">{area.title}</h3>
                      <p className="mt-5 max-w-[480px] text-sm leading-[1.75] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{area.copy}</p>
                      <Link href="/contact" className="focus-ring mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d] group-hover:text-[#47c6b3]" data-testid={`link-programme-involve-${area.id}`}>Get involved <ArrowUpRight size={14} /></Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-24 sm:py-32" aria-labelledby="programme-cycle-title">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>02 / How we work</SectionLabel>
            <h2 id="programme-cycle-title" className="mt-6 max-w-[420px] font-display text-5xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">Small steps. A longer view.</h2>
            <p className="mt-7 max-w-[360px] text-base leading-relaxed text-[#173d32]/65">From a first conversation to a new skill, our programmes are designed to make participation feel possible and progress feel visible.</p>
          </Reveal>
          <div className="relative">
            <div className="absolute bottom-8 left-6 top-8 w-px bg-[#47c6b3]/55 sm:left-8" />
            {[
              ['01', 'Listen', 'Start with local priorities and the knowledge already present in a community.'],
              ['02', 'Equip', 'Share life skills, practical tools and opportunities that can be used beyond a single event.'],
              ['03', 'Connect', 'Bring organisations, mentors and communities into stronger relationships.'],
              ['04', 'Carry forward', 'Reflect, learn and keep the most useful ideas moving into what comes next.'],
            ].map(([number, title, copy], index) => (
              <Reveal key={number} className={`delay-${Math.min(index + 1, 3)}`}>
                <div className="relative grid grid-cols-[48px_1fr] gap-6 border-b border-[#173d32]/15 py-8 sm:grid-cols-[64px_1fr] sm:gap-8">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#47c6b3] bg-[#f7f3e8] font-mono text-[10px] font-bold text-[#1d664d] sm:h-16 sm:w-16">{number}</span>
                  <div><h3 className="font-display text-3xl leading-none text-[#173d32] sm:text-4xl">{title}</h3><p className="mt-4 max-w-[480px] text-sm leading-[1.7] text-[#173d32]/65">{copy}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-12">
          <Reveal>
            <SectionLabel>03 / Build with us</SectionLabel>
            <h2 className="mt-6 max-w-[700px] font-display text-5xl leading-[.93] tracking-[-.04em] sm:text-7xl">Your expertise can become someone else’s next step.</h2>
          </Reveal>
          <Reveal className="delay-1">
            <Link href="/contact" className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-full bg-[#f2b857] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32] transition-transform hover:-translate-y-1" data-testid="link-programs-contact">Explore a partnership <ArrowUpRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Stories() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/stories" />
      <SiteHeader />
      <PageIntro
        eyebrow="Stories · Learning in motion"
        title={<>Change has a thousand starting points.</>}
        copy="A book shared. A business idea made practical. A new relationship built across a table. These are the moments that make development feel close enough to touch."
      />
      <section className="bg-[#f7f3e8] py-24 sm:py-32" aria-labelledby="stories-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-7 border-b border-[#173d32]/15 pb-9 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>01 / In focus</SectionLabel>
                <h2 id="stories-title" className="mt-4 max-w-[650px] font-display text-5xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-7xl">The work is made of real moments.</h2>
              </div>
              <p className="max-w-[260px] text-sm leading-relaxed text-[#173d32]/65">Stories are not decoration around development. They are how we notice what is changing.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
            <Reveal>
              <article className="overflow-hidden rounded-[2rem] bg-[#173d32] text-[#f7f3e8]" data-testid="card-story-reading">
                <div className="relative h-[300px] overflow-hidden bg-[#dce9e2] sm:h-[430px]">
                  <img src={referenceImage} alt="YDHRA community gathering reference" className="h-full w-full object-cover object-top opacity-90" data-testid="img-story-reading" />
                  <div className="absolute bottom-5 left-5 rounded-full bg-[#f2b857] px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-[#173d32]">Reading culture</div>
                </div>
                <div className="p-8 sm:p-10">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#47c6b3]">A wider world begins with a page</p>
                  <h3 className="mt-5 max-w-[550px] font-display text-4xl leading-[.95] tracking-[-.035em] sm:text-5xl">When young people gather around stories, curiosity becomes a shared language.</h3>
                  <p className="mt-6 max-w-[540px] text-sm leading-[1.75] text-[#f7f3e8]/65">Our reading festivals and learning trips create the space to ask better questions, meet new ideas and see possibility beyond the familiar.</p>
                </div>
              </article>
            </Reveal>
            <div className="grid gap-6">
              <Reveal className="delay-1">
                <article className="flex min-h-[300px] flex-col justify-between rounded-[2rem] bg-[#f2b857] p-8 text-[#173d32] sm:p-10" data-testid="card-story-livelihoods">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#173d32]/70">Economic empowerment</span>
                    <Sprout size={23} />
                  </div>
                  <div><h3 className="font-display text-4xl leading-[.95]">A skill is a door you can carry.</h3><p className="mt-5 text-sm leading-[1.7] text-[#173d32]/70">Financial literacy turns everyday choices into longer-term agency — one saving habit, one business idea, one conversation at a time.</p></div>
                </article>
              </Reveal>
              <Reveal className="delay-2">
                <article className="flex min-h-[300px] flex-col justify-between rounded-[2rem] bg-[#e4eee9] p-8 text-[#173d32] sm:p-10" data-testid="card-story-partnerships">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Partnerships</span>
                    <HeartHandshake size={23} />
                  </div>
                  <div><h3 className="font-display text-4xl leading-[.95]">The bridge matters as much as the destination.</h3><p className="mt-5 text-sm leading-[1.7] text-[#173d32]/65">Every organisation that shares its knowledge or resources adds strength to the circle around a community.</p></div>
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f2b857] py-24 sm:py-32">
        <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="font-display text-[7rem] leading-none text-[#e6a443]">“</span>
            <blockquote className="mx-auto max-w-[900px] font-display text-[clamp(2.4rem,5vw,5rem)] leading-[.95] tracking-[-.045em] text-[#173d32]">We believe progress grows when people have the voice, knowledge and resources to make it their own.</blockquote>
            <Link href="/contact" className="focus-ring mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[.15em] text-[#173d32]" data-testid="link-stories-contact">Share your story with us <ArrowUpRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Impact() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/impact" />
      <SiteHeader />
      <PageIntro
        eyebrow="Impact · How progress takes shape"
        title={<>Change is a practice, not a headline.</>}
        copy="YDHRA measures progress in the things that last: a stronger voice, a useful skill, a safer environment and a relationship that keeps opening doors."
      />
      <section className="bg-[#f7f3e8] py-24 sm:py-32 lg:py-40" aria-labelledby="impact-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Signals of progress</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-8 border-b border-[#173d32]/15 pb-10 lg:flex-row lg:items-end">
              <h2 id="impact-title" className="max-w-[700px] font-display text-5xl leading-[.93] tracking-[-.04em] text-[#173d32] sm:text-7xl">When people have more room to act, communities move.</h2>
              <p className="max-w-[290px] text-sm leading-relaxed text-[#173d32]/65">Our work connects voice, capability and community so change can continue after a single programme ends.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-[#173d32]/12 bg-[#173d32]/12 sm:grid-cols-3">
            {impactSignals.map((signal, index) => {
              const ProgrammeIcon = signal.icon;
              return (
                <Reveal key={signal.number} className={`delay-${index + 1}`}>
                  <article className="flex min-h-[350px] flex-col justify-between bg-[#e4eee9] p-8 sm:p-10" data-testid={`card-impact-${signal.title.toLowerCase()}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d]">{signal.number}</span>
                      <div className={`rounded-full p-3 ${signal.accent === 'sun' ? 'bg-[#f2b857]' : signal.accent === 'blue' ? 'bg-[#79b4c3]' : 'bg-[#47c6b3]'}`}><ProgrammeIcon size={22} className="text-[#173d32]" /></div>
                    </div>
                    <div>
                      <h3 className="font-display text-4xl leading-none text-[#173d32]">{signal.title}</h3>
                      <p className="mt-5 text-sm leading-[1.7] text-[#173d32]/65">{signal.copy}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#173d32] py-24 text-[#f7f3e8] sm:py-32 lg:py-40" aria-labelledby="impact-method-title">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>02 / The YDHRA method</SectionLabel>
            <h2 id="impact-method-title" className="mt-6 max-w-[440px] font-display text-5xl leading-[.93] tracking-[-.04em] sm:text-6xl">Start close. Build outward.</h2>
            <p className="mt-8 max-w-[360px] text-base leading-relaxed text-[#f7f3e8]/65">The work is deliberately human-sized. We listen to what is happening, make knowledge useful, connect the right people and keep learning as we go.</p>
          </Reveal>
          <div className="relative">
            <div className="absolute bottom-8 left-6 top-8 w-px bg-[#47c6b3]/40 sm:left-8" />
            {[
              ['01', 'Listen close', 'Begin with lived experience, local knowledge and the priorities people name for themselves.'],
              ['02', 'Make it useful', 'Turn rights, life skills and learning into practical tools for daily decisions and long-term choices.'],
              ['03', 'Build outward', 'Invite mentors, institutions, civil society and supporters into relationships that add strength.'],
              ['04', 'Keep learning', 'Reflect with the people involved, carry forward what works and stay honest about what needs to change.'],
            ].map(([number, title, copy], index) => (
              <Reveal key={number} className={`delay-${Math.min(index + 1, 3)}`}>
                <div className="relative grid grid-cols-[48px_1fr] gap-6 border-b border-[#f7f3e8]/15 py-8 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-10">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#47c6b3] bg-[#173d32] font-mono text-[10px] font-bold text-[#47c6b3] sm:h-16 sm:w-16">{number}</span>
                  <div><h3 className="font-display text-3xl leading-none sm:text-4xl">{title}</h3><p className="mt-4 max-w-[500px] text-sm leading-[1.7] text-[#f7f3e8]/62">{copy}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f2b857] py-24 sm:py-32">
        <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="font-display text-[7rem] leading-none text-[#e6a443]">“</span>
            <blockquote className="mx-auto max-w-[900px] font-display text-[clamp(2.4rem,5vw,5rem)] leading-[.95] tracking-[-.045em] text-[#173d32]">The strongest impact is not a moment of attention. It is a person knowing what they can do next.</blockquote>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/programs" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-impact-programmes">Explore programmes <ArrowRight size={16} /></Link>
              <Link href="/donate" className="focus-ring inline-flex items-center gap-3 rounded-full border border-[#173d32]/25 px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-impact-donate">Support the work <ArrowUpRight size={16} /></Link>
            </div>
          </Reveal>
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
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Thank you for standing with us</p>
          <h2 className="mt-5 max-w-[500px] font-display text-5xl leading-[.92]">Your support can move a life forward.</h2>
          <p className="mt-6 max-w-[440px] text-sm leading-relaxed text-[#f7f3e8]/65">We’ve recorded your interest in a {frequency} contribution of ${Number(amount).toFixed(2)}. The YDHRA team will contact you at {email} to confirm the best way to complete it.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:ydhrawanda@mail.com" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-donation-email">Email YDHRA <Mail size={15} /></a>
          <button type="button" onClick={() => setSubmitted(false)} className="focus-ring inline-flex items-center gap-2 border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.14em] text-[#47c6b3]" data-testid="button-donation-again">Make another donation</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitDonation} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-donation">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Your contribution</p>
          <p className="mt-2 text-sm text-[#173d32]/60">Every amount is a vote for possibility.</p>
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
          <option value="financial-literacy">Financial literacy &amp; livelihoods</option>
          <option value="reading">Reading &amp; learning festivals</option>
          <option value="wellbeing">Nutrition, sanitation &amp; shelter</option>
        </select>
      </label>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Your name</span><input value={name} onChange={(event) => setName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="Full name" data-testid="input-donation-name" /></label>
        <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-sm text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@example.org" data-testid="input-donation-email" /></label>
      </div>
      <button type="submit" className="focus-ring mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-donation">Continue with ${Number(amount) > 0 ? Number(amount).toFixed(2) : '0.00'} <ArrowRight size={16} /></button>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#173d32]/55">This form starts your donation request. The YDHRA team will contact you to confirm payment details securely.</p>
    </form>
  );
}

function Donate() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/donate" />
      <SiteHeader />
      <PageIntro
        eyebrow="Support YDHRA · Make a difference"
        title={<>Put possibility within reach.</>}
        copy="Your support helps young people and women access the knowledge, relationships and resources that turn human rights into lived experience."
      />
      <section className="bg-[#f7f3e8] py-24 sm:py-32" aria-labelledby="donate-title">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Why give</SectionLabel>
            <h2 id="donate-title" className="mt-6 max-w-[430px] font-display text-5xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">Support that keeps moving.</h2>
            <p className="mt-8 max-w-[380px] text-base leading-relaxed text-[#173d32]/65">A contribution can help make a reading festival possible, strengthen a financial literacy session, or support the everyday work of building safer, more informed communities.</p>
            <div className="mt-10 space-y-5 border-t border-[#173d32]/15 pt-6">
              {[
                ['Your gift', 'Moves directly toward a YDHRA focus area.'],
                ['Your choice', 'Can be one-time or a monthly commitment.'],
                ['Your voice', 'Helps keep rights and development in the same conversation.'],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-4" data-testid={`text-donation-benefit-${title.toLowerCase().replaceAll(' ', '-')}`}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#47c6b3]" />
                  <div><p className="font-semibold text-[#173d32]">{title}</p><p className="mt-1 text-sm leading-relaxed text-[#173d32]/60">{copy}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-[#f2b857] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]/70">Prefer to speak first?</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/70">Call us on +250 788 557 229 or email ydhrawanda@mail.com and we’ll help you find the right way to give.</p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            <DonationForm />
          </Reveal>
        </div>
      </section>
      <section className="bg-[#e4eee9] py-20 sm:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <div><SectionLabel>02 / Other ways to help</SectionLabel><p className="mt-4 max-w-[580px] font-display text-4xl leading-[.96] text-[#173d32] sm:text-5xl">Your time, knowledge and connections matter too.</p></div>
          <Link href="/contact" className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="link-donate-contact">Talk about a partnership <ArrowUpRight size={16} /></Link>
        </div>
      </section>
      <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="donation-faq-title">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>03 / Good to know</SectionLabel>
            <h2 id="donation-faq-title" className="mt-5 max-w-[420px] font-display text-5xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">Give with clarity.</h2>
            <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-[#173d32]/65">We want every supporter to understand what happens next. Here are a few common questions.</p>
          </Reveal>
          <Reveal className="delay-1">
            <div className="divide-y divide-[#173d32]/15 border-y border-[#173d32]/15">
              {donationFaqs.map(([question, answer], index) => (
                <details key={question} className="group py-6" data-testid={`details-donation-faq-${index + 1}`}>
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-[#173d32]">
                    {question}
                    <ChevronRight size={19} className="shrink-0 text-[#1d664d] transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 max-w-[640px] pr-8 text-sm leading-[1.75] text-[#173d32]/65">{answer}</p>
                </details>
              ))}
            </div>
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
        eyebrow="Contact · Work with us"
        title={<>Bring your <em className="font-normal text-[#47c6b3]">good</em> idea.</>}
        copy="Partnerships can start with a question, a resource, a room or a shared conviction. Tell us what you are building."
      />
      <section className="bg-[#f7f3e8] py-24 sm:py-32 lg:py-40" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-28 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Start here</SectionLabel>
            <h2 id="contact-title" className="mt-6 max-w-[500px] font-display text-6xl leading-[.9] tracking-[-.05em] text-[#173d32] sm:text-8xl">Let’s find the thread.</h2>
            <div className="mt-12 space-y-4 border-t border-[#173d32]/15 pt-6 text-sm text-[#173d32]/70">
              <p className="flex items-center gap-3"><MapPin size={16} className="text-[#1d664d]" /> Kigali, Rwanda</p>
              <a href="mailto:ydhrawanda@mail.com" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-email"><Mail size={16} className="text-[#1d664d]" /> ydhrawanda@mail.com</a>
              <a href="tel:+250788557229" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone"><Phone size={16} className="text-[#1d664d]" /> +250 788 557 229</a>
            </div>
            <div className="mt-10 rounded-2xl bg-[#e4eee9] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d]">Good to know</p>
              <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">We welcome conversations about programme partnerships, learning, resources, volunteering and ways to help communities lead their own development.</p>
            </div>
          </Reveal>
          <Reveal className="delay-1">
            {sent ? (
              <div className="flex min-h-[500px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-contact-success">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]"><Check size={26} /></div>
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Message received</p><h3 className="mt-5 max-w-[420px] font-display text-5xl leading-[.92]">Thank you, {formName.split(' ')[0]}.</h3><p className="mt-5 max-w-[380px] text-sm leading-relaxed text-[#f7f3e8]/65">Your note is ready for the YDHRA team. We look forward to finding the thread we can pull together.</p></div>
                <button type="button" onClick={() => setSent(false)} className="focus-ring self-start border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.15em] text-[#47c6b3]" data-testid="button-send-another">Send another message</button>
              </div>
            ) : (
              <form onSubmit={submitForm} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-contact">
                <div className="mb-8 flex items-center justify-between"><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Start here</p><span className="font-display text-4xl text-[#47c6b3]">→</span></div>
                <label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Your name</span><input value={formName} onChange={(event) => setFormName(event.target.value)} required name="name" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="How should we call you?" data-testid="input-contact-name" /></label>
                <label className="mt-7 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Email address</span><input value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required type="email" name="email" className="focus-ring mt-3 w-full border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="you@organisation.org" data-testid="input-contact-email" /></label>
                <label className="mt-7 block"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">What are you thinking about?</span><textarea value={formMessage} onChange={(event) => setFormMessage(event.target.value)} required name="message" rows={4} className="focus-ring mt-3 w-full resize-none border-b border-[#173d32]/25 bg-transparent py-3 text-lg text-[#173d32] outline-none placeholder:text-[#173d32]/35" placeholder="A partnership, an idea, a question..." data-testid="input-contact-message" /></label>
                <button type="submit" className="focus-ring mt-9 inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-contact">Send your note <MoveRight size={16} /></button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
      <section className="bg-[#f2b857] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionLabel>02 / Prefer a direct route?</SectionLabel>
            <div className="mt-5 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <p className="max-w-[650px] font-display text-4xl leading-[.96] text-[#173d32] sm:text-5xl">Call, email or start with a donation request.</p>
              <Link href="/donate" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]" data-testid="link-contact-donate">Support YDHRA <ArrowRight size={16} /></Link>
            </div>
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
      <Route path="/impact" component={Impact} />
      <Route path="/stories" component={Stories} />
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