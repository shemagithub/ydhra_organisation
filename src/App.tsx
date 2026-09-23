import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
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
  Scale,
  Shield,
  Smartphone,
  CreditCard,
  Users,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useRoute } from 'wouter';
import creationCareLogo from '@/assets/creation-care-logo.png';
import creationCareLogoLight from '@/assets/creation-care-logo-light.png';
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
  { label: 'About Us', href: '/about' },
  { label: 'Our Programs', href: '/programs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Team', href: '/team' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
];

const programs = [
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
    title: 'Christian Education Program',
    copy: 'Educating minds, shaping character, and transforming lives through quality education that develops the whole person academically, spiritually, socially, and emotionally.',
    accent: 'sun',
  },
  {
    id: 'child-protection',
    number: '03',
    icon: Shield,
    category: 'Safeguarding',
    title: 'Child Protection',
    copy: 'Creating safe environments where children are protected from abuse, exploitation, neglect, and violence, and are given opportunities to grow and flourish.',
    accent: 'blue',
  },
  {
    id: 'christian-discipleship',
    number: '04',
    icon: BookOpen,
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
    copy: 'Students from around the world share traditions through dance, food, games, and adventures. Study trips blend education with cultural immersion that inspires unity, respect, and lifelong friendships.',
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
    copy: 'Equipping churches, young people, families, and communities to respond responsibly to climate change and care for God’s creation.',
    accent: 'blue',
  },
  {
    id: 'refugees',
    number: '08',
    icon: HeartHandshake,
    category: 'Refugees',
    title: 'Refugees Program',
    copy: 'Serving displaced families with dignity, practical support, and Christ-centered care so vulnerable communities can find hope, safety, and opportunity.',
    accent: 'leaf',
  },
];

const teamRoles = [
  {
    title: 'Founder & Executive Director',
    copy: 'Provides overall vision and strategic leadership for Creation Care Foundation and guides the organization’s Christian mission and programs.',
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
    copy: 'Supports responsible financial management, administration, accountability, and organizational operations.',
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

const involveWays = [
  {
    title: 'Volunteer',
    copy: 'Share your time and skills in mentorship, education, safeguarding, and community programs.',
    href: '/contact',
  },
  {
    title: 'Become a Mentor',
    copy: 'Walk alongside children, youth, and emerging leaders through Biblical mentoring and life guidance.',
    href: '/contact',
  },
  {
    title: 'Partner With Us',
    copy: 'Churches, schools, ministries, and organizations can join us in lasting Gospel-shaped change.',
    href: '/contact',
  },
  {
    title: 'Prayer',
    copy: 'Pray for our team, partners, children, and communities as we serve with faithfulness.',
    href: '/contact',
  },
  {
    title: 'Donate',
    copy: 'Your generosity helps mentor young people, protect children, educate, and care for creation.',
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
  'Youth organizations',
  'Community organizations',
  'Nonprofit organizations',
  'Environmental organizations',
  'Local communities',
  'Christian leaders and mentors',
  'Individuals and donors',
];

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  accent: string;
  body: string[];
};

const blogPosts: BlogPost[] = [
  {
    slug: 'called-to-care-for-creation',
    title: 'Called to care for creation',
    date: '12 March 2026',
    category: 'Creation care',
    excerpt:
      'Faithful stewardship begins with remembering that God is the Creator of all things — and that every person is made in His image.',
    accent: 'teal',
    body: [
      'Creation Care Foundation exists because we believe God is the Creator of all things. Every person is created in God’s image, and Christians are called to love God, love their neighbors, protect the vulnerable, and faithfully care for creation.',
      'When churches, families, and young people respond to climate change with responsibility and hope, creation care becomes discipleship in action — not a separate activity from following Jesus.',
      'Across our Climate Change & Creation Care program, we equip churches, young people, families, and communities with practical tools for environmental education, community resilience, and faithful stewardship.',
      'We invite partners and supporters to join us in mentoring the next generation, protecting children, upholding human dignity, and caring for the world God has entrusted to us.',
    ],
  },
  {
    slug: 'biblical-mentorship-that-shapes-character',
    title: 'Biblical mentorship that shapes character',
    date: '28 February 2026',
    category: 'Mentorship',
    excerpt:
      'Walking alongside children, youth, and emerging leaders through Scripture, prayer, and practical life guidance.',
    accent: 'sun',
    body: [
      'Biblical mentorship is one of the heartbeats of our work. We walk alongside children, youth, and emerging leaders through Bible-based mentoring, character development, leadership training, prayer, and practical life guidance.',
      'Mentorship is not only about teaching skills. It is about forming people who follow Christ, serve others with humility, and become faithful stewards in their communities.',
      'Our mentors pray with young people, open Scripture together, and offer practical support for school, family life, and leadership responsibilities.',
      'If you feel called to become a mentor, we would love to connect with you and help you serve through Creation Care Foundation.',
    ],
  },
  {
    slug: 'protecting-children-creating-safe-spaces',
    title: 'Protecting children and creating safe spaces',
    date: '10 February 2026',
    category: 'Child protection',
    excerpt:
      'Every child deserves a safe environment where they can grow, flourish, and know their God-given dignity.',
    accent: 'blue',
    body: [
      'Child protection is central to our Christian mission. We work to create safe environments where children are protected from abuse, exploitation, neglect, and violence.',
      'Through safeguarding, training, and community programs, we help families, churches, and partners build cultures of care where children can flourish.',
      'Our Child Protection Coordinator oversees protection programs, training, and safe-environment initiatives so that care for children remains intentional and accountable.',
      'Protecting children is one way we honor the truth that every person is created in God’s image and deserves dignity, safety, and hope.',
    ],
  },
  {
    slug: 'care-school-investing-in-children',
    title: 'Care School: investing in children, building communities',
    date: '22 January 2026',
    category: 'Education',
    excerpt:
      'Care Nursery and Primary School provides a strong foundation for lifelong learning, character, and responsible citizenship.',
    accent: 'leaf',
    body: [
      'Care Nursery and Primary School Education is an investment in children and in the future of the communities they will shape.',
      'Our approach goes beyond academic achievement. We create a safe and nurturing environment where young children develop knowledge, confidence, creativity, character, and practical skills.',
      'Through quality early childhood and primary education, children build foundations in literacy, numeracy, communication, and critical thinking — while learning to care for others, community, and the natural environment.',
      'Through partnerships and support, we can strengthen learning resources, equip teachers, and ensure more children have access to a safe and enriching educational environment.',
    ],
  },
  {
    slug: 'christian-discipleship-in-everyday-life',
    title: 'Christian discipleship in everyday life',
    date: '8 January 2026',
    category: 'Discipleship',
    excerpt:
      'Helping people grow in their relationship with Jesus through Bible study, prayer, service, and creation-care discipleship.',
    accent: 'teal',
    body: [
      'Christian Discipleship at Creation Care Foundation helps people grow in their relationship with Jesus Christ through Bible study, prayer, spiritual formation, service, evangelism, and creation-care discipleship.',
      'We believe discipleship should shape daily life — how we treat neighbors, how we protect the vulnerable, and how we care for the world God made.',
      'When faith and action meet, communities become places of compassion, justice, and hope. That is the kind of discipleship we seek to nurture across our programs.',
    ],
  },
  {
    slug: 'partnering-with-churches-and-communities',
    title: 'Partnering with churches and communities',
    date: '18 December 2025',
    category: 'Partnership',
    excerpt:
      'Lasting change happens when churches, schools, mentors, and neighbors work together for the good of people and creation.',
    accent: 'sun',
    body: [
      'Creation Care Foundation believes that lasting change happens when people work together. We welcome partnerships with churches, Christian ministries, schools, youth organizations, community groups, and donors.',
      'Partnership can look like mentoring, prayer, volunteering, hosting programs, supporting Care School, or funding child protection and climate initiatives.',
      'Together, we can mentor the next generation, protect children, strengthen communities, uphold human dignity, and care for God’s creation.',
    ],
  },
];

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
      'Stories and reflections from Creation Care Foundation on mentorship, child protection, discipleship, and creation care.',
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
    <Link href="/" className="focus-ring flex min-w-0 items-center" data-testid="link-brand">
      <img
        src={dark ? creationCareLogo : creationCareLogoLight}
        alt="Creation Care Foundation"
        className="h-14 w-auto max-w-[min(78vw,300px)] object-contain object-left sm:h-16 sm:max-w-[360px] lg:h-[4.5rem] lg:max-w-[420px]"
        data-testid="img-brand-mark"
      />
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
              className={`focus-ring relative text-[11px] font-bold uppercase tracking-[.12em] transition-colors ${location === item.href || location.startsWith(`${item.href}/`) ? 'text-[#f2b857]' : navColor}`}
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
            className="focus-ring rounded-full bg-[#f2b857] px-5 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#173d32] transition-transform hover:-translate-y-0.5"
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
            Follow Christ. Mentor the next generation. Protect children. Uphold human dignity. Care for creation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#f7f3e8]/65">
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
        <span>Kicukiro Masaka, Kigali</span>
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

function Home() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/" />
      <SiteHeader />
      <section
        className="relative flex min-h-[720px] items-end overflow-hidden bg-[#173d32] pb-16 pt-36 text-[#f7f3e8] sm:min-h-[800px] sm:pb-24 lg:min-h-[860px] lg:pb-28"
        aria-labelledby="hero-title"
      >
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-32 top-20 h-[560px] w-[560px] rounded-full border border-[#47c6b3]/20" />
        <div className="absolute -right-16 top-36 h-[390px] w-[390px] rounded-full border border-[#f2b857]/20" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-16 lg:px-12">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#47c6b3]">
                <span className="h-px w-10 bg-[#47c6b3]" /> Creation Care Foundation · CCF
              </div>
            </Reveal>
            <Reveal className="delay-1">
              <h1 id="hero-title" className="font-display text-[clamp(2.8rem,8vw,6.8rem)] leading-[.9] tracking-[-.05em] text-balance">
                Caring for people.<br />
                <em className="font-normal text-[#47c6b3]">Faithfully</em> caring for creation.
              </h1>
            </Reveal>
            <Reveal className="delay-2">
              <p className="mt-8 max-w-[560px] text-base leading-relaxed text-[#f7f3e8]/72 sm:text-lg">
                A Christian organization committed to caring for God’s creation, developing people, protecting children, promoting human dignity, and serving vulnerable communities.
              </p>
            </Reveal>
            <Reveal className="delay-3">
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#47c6b3] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#173d32] transition-transform hover:-translate-y-1"
                  data-testid="link-hero-about"
                >
                  Discover our story <ArrowDown size={16} />
                </Link>
                <Link
                  href="/get-involved"
                  className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-colors hover:text-[#f2b857]"
                  data-testid="link-hero-involve"
                >
                  Get involved <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="delay-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#f7f3e8]/25 bg-[#f7f3e8] shadow-2xl">
              <div className="flex h-[220px] items-center justify-center bg-[#173d32] sm:h-[280px]">
                <img
                  src={creationCareLogoLight}
                  alt="Creation Care Foundation"
                  className="h-20 w-auto max-w-[85%] object-contain sm:h-24"
                  data-testid="img-hero-logo"
                />
              </div>
              <div className="px-5 py-5 text-[#173d32]">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#1d664d]">Our belief</p>
                <p className="mt-2 text-sm leading-relaxed font-semibold">
                  Every person is created in God’s image. We are called to love God, love our neighbors, protect the vulnerable, and care for creation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[#173d32]/10 bg-[#f2b857] py-5">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 sm:justify-between sm:px-8 lg:px-12">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]">Faith · Dignity · Stewardship</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]">Protect children · Develop people</p>
          <Link href="/programs" className="focus-ring group flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#173d32]" data-testid="link-ribbon-programs">
            Explore our programs <MoveRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="home-vision-title">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Vision</SectionLabel>
            <h2 id="home-vision-title" className="mt-5 font-display text-4xl leading-[.96] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              A Christ-centered world where people flourish.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#173d32]/65">
              A world where children are protected, human dignity is respected, and God’s creation is faithfully cared for.
            </p>
          </Reveal>
          <Reveal className="delay-1">
            <SectionLabel>02 / Mission</SectionLabel>
            <p className="mt-5 text-[clamp(1.25rem,2.5vw,1.85rem)] leading-[1.25] tracking-[-.03em] text-[#173d32]">
              To mentor, disciple, educate, protect, and empower individuals and communities through Biblical principles so they can follow Christ, serve others, protect the vulnerable, and become faithful stewards of God’s creation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e4eee9] py-20 sm:py-28" aria-labelledby="home-programs-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-[#173d32]/15 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>03 / Our programs</SectionLabel>
                <h2 id="home-programs-title" className="mt-4 max-w-[700px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
                  Discipleship, development, and creation care — together.
                </h2>
              </div>
              <Link href="/programs" className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-home-all-programs">
                View all programs <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#173d32]/15 bg-[#173d32]/15 sm:grid-cols-2 lg:grid-cols-4">
            {programs.slice(0, 4).map((program, index) => {
              const Icon = program.icon;
              return (
                <Reveal key={program.id} className={`delay-${Math.min(index + 1, 3)}`}>
                  <article className="group flex min-h-[300px] flex-col justify-between bg-[#f7f3e8] p-7 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]" data-testid={`card-home-program-${program.id}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-[.18em] text-[#1d664d] group-hover:text-[#47c6b3]">{program.number}</span>
                      <div className={`rounded-full p-3 ${accentClass(program.accent)}`}>
                        <Icon size={20} className="text-[#173d32]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl leading-[1.05] tracking-[-.03em]">{program.title}</h3>
                      <p className="mt-4 text-sm leading-[1.65] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{program.copy}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-20 sm:py-28" aria-labelledby="home-blog-title">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-[#173d32]/15 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>04 / Blog</SectionLabel>
                <h2 id="home-blog-title" className="mt-4 max-w-[640px] font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-6xl">
                  Stories from the mission.
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
                  className="group flex h-full min-h-[260px] flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#e4eee9] p-6 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]"
                  data-testid={`card-home-blog-${post.slug}`}
                >
                  <span className={`w-fit rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(post.accent)}`}>
                    {post.category}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-[1.05]">{post.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173d32] py-20 text-[#f7f3e8] sm:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <Reveal>
            <SectionLabel>05 / Call to action</SectionLabel>
            <h2 className="mt-5 max-w-[720px] font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-6xl">
              Be part of God’s work of caring for creation.
            </h2>
            <p className="mt-6 max-w-[520px] text-sm leading-relaxed text-[#f7f3e8]/65">
              Whether you pray, give, volunteer, mentor, partner, or serve — you can be part of the mission.
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/about" />
      <SiteHeader />
      <PageIntro
        eyebrow="About Us · Creation Care Foundation"
        title={<>A Christian organization caring for people and creation.</>}
        copy="Creation Care Foundation (CCF) is committed to caring for God’s creation, developing people, protecting children, promoting human dignity, and serving vulnerable communities."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-24 lg:px-12">
          <Reveal>
            <SectionLabel>01 / What we believe</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.95] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Created by God. Called to love and care.
            </h2>
          </Reveal>
          <Reveal className="delay-1">
            <p className="text-[clamp(1.2rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-.025em] text-[#173d32]">
              We believe that God is the Creator of all things, every person is created in God’s image, and Christians are called to love God, love their neighbors, protect the vulnerable, and faithfully care for creation.
            </p>
            <p className="mt-8 text-base leading-[1.8] text-[#173d32]/65">
              Biblical discipleship, human development, child protection, and creation care are integrated in our work — not treated as separate activities.
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
                A Christ-centered world where people flourish.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#f7f3e8]/65">
                Children are protected, human dignity is respected, and God’s creation is faithfully cared for.
              </p>
            </article>
          </Reveal>
          <Reveal className="delay-1">
            <article className="h-full rounded-[2rem] bg-[#f2b857] p-8 text-[#173d32] sm:p-12">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#173d32]/70">03 / Mission</span>
              <h2 className="mt-10 font-display text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
                Mentor. Disciple. Educate. Protect. Empower.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#173d32]/70">
                Through Biblical principles, we help people follow Christ, serve others, protect the vulnerable, and become faithful stewards of God’s creation.
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
              Investing in children. Building stronger communities.
            </h2>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-[#173d32]/65">
              Care Nursery and Primary School provides children with a strong foundation for lifelong learning, personal development, and responsible citizenship in a safe, nurturing environment.
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/programs" />
      <SiteHeader />
      <PageIntro
        eyebrow="Our Programs · Discipleship & development"
        title={<>Programs that form people and care for creation.</>}
        copy="From Biblical mentorship and Christian education to child protection, climate care, and refugee support — our programs integrate faith, dignity, and stewardship."
      />
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
              const Icon = program.icon;
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
              <div className="flex h-[220px] items-center justify-center bg-[#173d32] sm:h-[280px]">
                <img
                  src={creationCareLogoLight}
                  alt="Creation Care Foundation"
                  className="h-16 w-auto max-w-[80%] object-contain sm:h-20"
                />
              </div>
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
  const reasons = [
    'Build strong foundations in literacy, numeracy, communication, and critical thinking.',
    'Encourage curiosity, creativity, and a love of learning.',
    'Give children opportunities to learn through practical and experiential activities.',
    'Promote care for others, the community, and the natural environment.',
    'Support children to become responsible and active members of society.',
  ];

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
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <Reveal>
            <p className="text-[clamp(1.25rem,2.6vw,1.9rem)] leading-[1.3] tracking-[-.03em] text-[#173d32]">
              Our education approach goes beyond academic achievement. We create a safe and nurturing environment where young children can develop knowledge, confidence, creativity, character, and practical skills.
            </p>
            <p className="mt-8 text-base leading-[1.8] text-[#173d32]/65">
              Through quality early childhood and primary education, we help children discover their potential and prepare them to participate positively in their families, communities, and wider society.
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
            {reasons.map((reason, index) => (
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
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/get-involved" />
      <SiteHeader />
      <PageIntro
        eyebrow="Get Involved · Pray · Give · Serve"
        title={<>Be part of the mission.</>}
        copy="Whether you pray, give, volunteer, mentor, partner, or serve — you can help mentor the next generation, protect children, uphold dignity, and care for creation."
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
  const [amount, setAmount] = useState('25');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [focus, setFocus] = useState('where-needed');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | 'card'>('momo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const paymentLabels = {
    momo: 'MTN MoMo',
    airtel: 'Airtel Money',
    card: 'Bank card',
  } as const;

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || Number(amount) <= 0) return;
    if ((paymentMethod === 'momo' || paymentMethod === 'airtel') && !phone.trim()) return;
    if (paymentMethod === 'card' && !phone.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] bg-[#173d32] p-8 text-[#f7f3e8] sm:p-12" data-testid="status-donation-success">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#47c6b3] text-[#173d32]">
          <Check size={27} />
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#47c6b3]">Thank you for your generosity</p>
          <h2 className="mt-5 max-w-[500px] font-display text-4xl leading-[.94] sm:text-5xl">Your gift can help transform lives.</h2>
          <p className="mt-6 max-w-[480px] text-sm leading-relaxed text-[#f7f3e8]/65">
            We’ve recorded your {frequency === 'monthly' ? 'monthly' : 'one-time'} gift of ${Number(amount).toFixed(2)} via{' '}
            <strong className="text-[#f7f3e8]">{paymentLabels[paymentMethod]}</strong>. The Creation Care team will contact you at {email}
            {phone ? ` / ${phone}` : ''} to complete the payment securely.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:ydhrarwanda@gmail.com" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#f2b857] px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#173d32]" data-testid="link-donation-email">
            Email Creation Care <Mail size={15} />
          </a>
          <button type="button" onClick={() => setSubmitted(false)} className="focus-ring inline-flex items-center gap-2 border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.14em] text-[#47c6b3]" data-testid="button-donation-again">
            Make another donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitDonation} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-donation">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#1d664d]">Your contribution</p>
          <p className="mt-2 text-sm text-[#173d32]/60">God loves a cheerful giver.</p>
        </div>
        <HeartHandshake size={24} className="text-[#1d664d]" />
      </div>
      <fieldset className="mt-8">
        <legend className="text-xs font-bold uppercase tracking-[.12em] text-[#173d32]">Choose an amount (USD)</legend>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['10', '25', '50', '100', '250', '500'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              className={`focus-ring rounded-xl border py-3 text-sm font-bold transition-colors ${amount === value ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`}
              data-testid={`button-donation-amount-${value}`}
            >
              ${value}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Custom donation amount</span>
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
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value as 'once' | 'monthly')}
              className={`focus-ring rounded-xl border py-3 text-sm font-bold transition-colors ${frequency === value ? 'border-[#173d32] bg-[#173d32] text-[#f7f3e8]' : 'border-[#173d32]/15 bg-[#f7f3e8] text-[#173d32] hover:border-[#1d664d]'}`}
              data-testid={`button-donation-frequency-${value}`}
            >
              {label}
            </button>
          ))}
        </div>
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
            { id: 'momo' as const, label: 'MTN MoMo', hint: 'Mobile money', Icon: Smartphone },
            { id: 'airtel' as const, label: 'Airtel Money', hint: 'Mobile money', Icon: Smartphone },
            { id: 'card' as const, label: 'Card', hint: 'Visa / Mastercard', Icon: CreditCard },
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
              ? 'We will call or email you a secure card payment link. We never ask for full card details on this page.'
              : `You will receive a ${paymentMethod === 'momo' ? 'MoMo' : 'Airtel Money'} prompt or confirmation instructions on this number.`}
          </p>
        </label>
      )}
      <button type="submit" className="focus-ring mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#173d32] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8] transition-transform hover:-translate-y-1" data-testid="button-submit-donation">
        Donate ${Number(amount) > 0 ? Number(amount).toFixed(2) : '0.00'} via {paymentLabels[paymentMethod]} <ArrowRight size={16} />
      </button>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#173d32]/55">
        Choose MoMo, Airtel Money, or card. We will confirm your gift and complete payment safely with you.
      </p>
    </form>
  );
}

function Donate() {
  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <Seo path="/donate" />
      <SiteHeader />
      <PageIntro
        eyebrow="Donate · Your giving can transform lives"
        title={<>Partner with us through your generosity.</>}
        copy="Your generosity helps Creation Care Foundation mentor young people, protect children, support communities, provide Christian education, develop leaders, promote human dignity, and care for God’s creation."
      />
      <section className="bg-[#f7f3e8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-12">
          <Reveal>
            <SectionLabel>01 / Why give</SectionLabel>
            <h2 className="mt-5 font-display text-4xl leading-[.94] tracking-[-.04em] text-[#173d32] sm:text-5xl">
              Every gift can build a more compassionate generation.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#173d32]/65">
              Your donation can support:
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
                We handle donations responsibly, transparently, and faithfully — using every resource to advance our mission and serve the communities we work with.
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
        title={<>Let’s start a conversation.</>}
        copy="Whether you want to volunteer, become a mentor, partner with us, support a project, invite us to your church or community, or simply learn more — we would love to connect."
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
                Kicukiro Masaka, Kigali
              </p>
              <a href="mailto:ydhrarwanda@gmail.com" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-email">
                <Mail size={16} className="text-[#1d664d]" /> ydhrarwanda@gmail.com
              </a>
              <a href="tel:+250788557229" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone">
                <Phone size={16} className="text-[#1d664d]" /> +250 788 557 229
              </a>
              <a href="tel:+250788423418" className="focus-ring flex items-center gap-3 hover:text-[#1d664d]" data-testid="link-contact-phone-2">
                <Phone size={16} className="text-[#1d664d]" /> +250 788 423 418
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
                    Your note is ready for the Creation Care team. We look forward to finding how we can work together.
                  </p>
                </div>
                <button type="button" onClick={() => setSent(false)} className="focus-ring self-start border-b border-[#47c6b3] pb-1 text-xs font-bold uppercase tracking-[.15em] text-[#47c6b3]" data-testid="button-send-another">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submitForm} className="rounded-[2rem] border border-[#173d32]/15 bg-[#e4eee9] p-6 sm:p-10" data-testid="form-contact">
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
        eyebrow="Blog · Stories & reflections"
        title={<>Stories that keep the mission visible.</>}
        copy="Read updates on Biblical mentorship, child protection, Christian education, discipleship, partnerships, and faithful care for God’s creation."
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
                className="group grid overflow-hidden rounded-[2rem] border border-[#173d32]/12 bg-[#173d32] text-[#f7f3e8] transition-transform hover:-translate-y-0.5 lg:grid-cols-[1.1fr_.9fr]"
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
                <div className="relative flex min-h-[240px] items-center justify-center bg-[#1d664d]/40 p-8 lg:min-h-full">
                  <div className="absolute inset-0 hero-grid opacity-40" />
                  <div className="relative text-center">
                    <p className={`mx-auto inline-flex rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(featured.accent)}`}>
                      {featured.category}
                    </p>
                    <p className="mt-8 font-display text-5xl leading-none text-[#47c6b3] sm:text-6xl">CCF</p>
                    <p className="mt-4 max-w-[220px] text-xs leading-relaxed text-[#f7f3e8]/60">
                      Creation Care Foundation journal
                    </p>
                  </div>
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
                  className="group flex h-full min-h-[300px] flex-col justify-between rounded-[1.75rem] border border-[#173d32]/12 bg-[#f7f3e8] p-7 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]"
                  data-testid={`card-blog-${post.slug}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(post.accent)}`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-[10px] tracking-[.12em] text-[#1d664d] group-hover:text-[#47c6b3]">{post.date}</span>
                  </div>
                  <div>
                    <h3 className="mt-8 font-display text-2xl leading-[1.08] tracking-[-.03em] sm:text-3xl">{post.title}</h3>
                    <p className="mt-4 text-sm leading-[1.7] text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="focus-ring mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#1d664d] group-hover:text-[#47c6b3]"
                      data-testid={`link-blog-${post.slug}`}
                    >
                      Read article <ArrowRight size={14} />
                    </Link>
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
  const [, params] = useRoute('/blog/:slug');
  const post = blogPosts.find((item) => item.slug === params?.slug);
  const related = blogPosts.filter((item) => item.slug !== post?.slug).slice(0, 3);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Creation Care Foundation Blog`;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', post.excerpt);
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <main id="top" className="min-h-[100dvh] overflow-hidden bg-[#f7f3e8]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-[#173d32] pb-16 pt-36 text-[#f7f3e8] sm:pb-20">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="relative z-10 mx-auto max-w-[860px] px-5 sm:px-8">
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
            <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[.95] tracking-[-.045em] text-balance">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-[#f7f3e8]/68 sm:text-lg">{post.excerpt}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f3e8] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_240px] lg:gap-16">
          <Reveal>
            <article className="space-y-6" data-testid="article-blog-body">
              {post.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-base leading-[1.9] text-[#173d32]/78 sm:text-lg">
                  {paragraph}
                </p>
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
                  className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-[#173d32]/12 bg-[#f7f3e8] p-6 transition-colors hover:bg-[#173d32] hover:text-[#f7f3e8]"
                  data-testid={`link-related-${item.slug}`}
                >
                  <span className={`w-fit rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#173d32] ${accentClass(item.accent)}`}>
                    {item.category}
                  </span>
                  <div>
                    <h3 className="mt-8 font-display text-2xl leading-[1.05]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65 group-hover:text-[#f7f3e8]/65">{item.excerpt}</p>
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
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog" component={Blog} />
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
