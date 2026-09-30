import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  Mail,
  Menu,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Users,
  BookOpen,
  Phone,
  Share2,
  HeartHandshake,
  LogOut,
  Wallet,
  Home,
  Info,
  HandHeart,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Video,
  Images,
} from 'lucide-react';
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminSaveContent,
  fetchDashboardStats,
  uploadAdminImage,
  createPayout,
  fetchMessages,
  fetchWallet,
  refreshPayout,
  updateMessageStatus,
} from '@/admin/api';
import { API_BASE } from '@/content/apiBase';
import { useSiteContent } from '@/content/ContentContext';
import OverviewCharts from '@/admin/OverviewCharts';
import type { BlogContentBlock, BlogPost, GalleryItem, SiteContent, SocialLink } from '@/content/types';
import { resolveVideoLink } from '@/content/video';

type SectionId =
  | 'overview'
  | 'contact'
  | 'social'
  | 'home'
  | 'about'
  | 'programs'
  | 'team'
  | 'involve'
  | 'donate'
  | 'blog'
  | 'gallery'
  | 'messages'
  | 'engagement'
  | 'wallet';

type NavItem = {
  id: SectionId;
  label: string;
  icon: typeof LayoutDashboard;
  badgeKey?: 'messages';
};

const sidebarGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Dashboard',
    items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    title: 'Content',
    items: [
      { id: 'blog', label: 'Blog', icon: BookOpen },
      { id: 'gallery', label: 'Gallery', icon: Images },
      { id: 'programs', label: 'Programs', icon: FolderKanban },
      { id: 'team', label: 'Team', icon: Users },
      { id: 'home', label: 'Home copy', icon: Home },
      { id: 'about', label: 'About', icon: Info },
      { id: 'involve', label: 'Get involved', icon: HandHeart },
      { id: 'donate', label: 'Donate', icon: HeartHandshake },
      { id: 'engagement', label: 'Impact & FAQ', icon: Globe2 },
    ],
  },
  {
    title: 'Site settings',
    items: [
      { id: 'contact', label: 'Contact', icon: Phone },
      { id: 'social', label: 'Social links', icon: Share2 },
    ],
  },
  {
    title: 'Payments',
    items: [{ id: 'wallet', label: 'Balance & payouts', icon: Wallet }],
  },
  {
    title: 'Communications',
    items: [{ id: 'messages', label: 'Contacts', icon: Mail, badgeKey: 'messages' }],
  },
];

const allNavItems = sidebarGroups.flatMap((group) => group.items);

const fieldClass =
  'mt-1.5 w-full rounded-2xl border border-[#e6e8f0] bg-white px-3.5 py-2.5 text-sm text-[#1d1e2c] outline-none transition focus:border-[#6c5ce7] focus:ring-4 focus:ring-[#6c5ce7]/15';
const labelClass = 'block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b7280]';

function emptyPost(): BlogPost {
  return {
    slug: `post-${Date.now()}`,
    title: 'New article',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: 'General',
    excerpt: '',
    accent: 'teal',
    cover: { src: '', alt: '' },
    content: [{ type: 'paragraph', text: '' }],
  };
}

function MetricCard({
  label,
  value,
  hint,
  tone = 'purple',
  children,
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'purple' | 'rose' | 'sky' | 'emerald';
  children?: ReactNode;
}) {
  const tones = {
    purple: 'from-[#6c5ce7]/15 to-[#a29bfe]/10',
    rose: 'from-[#ff6b81]/15 to-[#ff9ff3]/10',
    sky: 'from-[#54a0ff]/15 to-[#7ed6df]/10',
    emerald: 'from-[#1dd1a1]/15 to-[#55efc4]/10',
  };
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-5 shadow-[0_10px_40px_rgba(29,30,44,0.06)]">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tones[tone]}`} />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#6b7280]">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-[#1d1e2c]">{value}</p>
        <p className="mt-2 text-xs font-medium text-[#6c5ce7]">{hint}</p>
        {children}
      </div>
    </div>
  );
}

type SavedContact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

function savedContact(row: Record<string, unknown>): SavedContact {
  return {
    id: Number(row.id),
    name: String(row.name || 'Unknown'),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    subject: String(row.subject || ''),
    message: String(row.message || ''),
    status: String(row.status || 'new'),
    createdAt: String(row.created_at || ''),
  };
}

function contactWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function GalleryEditor({
  draft,
  setDraft,
  onNotice,
}: {
  draft: SiteContent;
  setDraft: Dispatch<SetStateAction<SiteContent>>;
  onNotice: (message: string | null) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  const intro = draft.galleryPage?.intro ?? { eyebrow: '', title: '', copy: '' };
  const photos = draft.gallery ?? [];

  const updateIntro = (key: 'eyebrow' | 'title' | 'copy', value: string) => {
    setDraft((prev) => ({
      ...prev,
      galleryPage: {
        intro: { ...(prev.galleryPage?.intro ?? intro), [key]: value },
      },
    }));
  };

  const updateItem = (id: string, patch: Partial<GalleryItem>) => {
    setDraft((prev) => ({
      ...prev,
      gallery: (prev.gallery ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const uploadFile = async (file: File, id?: string) => {
    setUploading(id ?? 'new');
    onNotice(null);
    const result = await uploadAdminImage(file);
    setUploading(null);
    if (!result.ok || !result.url) {
      onNotice(result.error ?? 'Could not upload that image. Use a photo under 8 MB.');
      return;
    }
    if (id) {
      updateItem(id, { src: result.url });
      onNotice('Photo replaced. Choose Save changes to publish it.');
      return;
    }
    const item: GalleryItem = {
      id: `photo-${Date.now()}`,
      src: result.url,
      alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      caption: '',
      category: 'Community',
    };
    setDraft((prev) => ({ ...prev, gallery: [item, ...(prev.gallery ?? [])] }));
    onNotice('Photo added. Add a caption, then choose Save changes to publish the gallery.');
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>, id?: string) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void uploadFile(file, id);
  };

  return (
    <section className="space-y-6" data-testid="admin-gallery">
      <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6 shadow-[0_10px_40px_rgba(29,30,44,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Gallery</h2>
            <p className="mt-1 max-w-xl text-sm text-[#6b7280]">Add a photo, edit its caption, or remove it. Save changes to show the update on the public gallery page.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#6c5ce7] px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={15} />
            {uploading === 'new' ? 'Uploading…' : 'Add image'}
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => onFile(event)} data-testid="input-gallery-add" />
          </label>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {([
            ['eyebrow', 'Eyebrow', intro.eyebrow],
            ['title', 'Page title', intro.title],
            ['copy', 'Introduction', intro.copy],
          ] as const).map(([key, label, value]) => (
            <label key={key} className="block">
              <span className={labelClass}>{label}</span>
              {key === 'copy' ? (
                <textarea className={fieldClass} rows={3} value={value} onChange={(event) => updateIntro(key, event.target.value)} />
              ) : (
                <input className={fieldClass} value={value} onChange={(event) => updateIntro(key, event.target.value)} />
              )}
            </label>
          ))}
        </div>
      </div>
      {photos.length === 0 ? (
        <p className="rounded-[1.5rem] border border-dashed border-[#d9dbe7] bg-white px-6 py-12 text-center text-sm text-[#6b7280]">No photographs yet. Add an image to start the gallery.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {photos.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-[#e6e8f0] bg-white shadow-[0_10px_40px_rgba(29,30,44,0.06)]" data-testid={`card-admin-gallery-${item.id}`}>
              <div className="grid sm:grid-cols-[180px_1fr]">
                <div className="relative min-h-[160px] bg-[#f4f5f8]">
                  {item.src ? <img src={item.src} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="space-y-3 p-4">
                  <label className="block">
                    <span className={labelClass}>Caption</span>
                    <input className={fieldClass} value={item.caption} onChange={(event) => updateItem(item.id, { caption: event.target.value })} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Category</span>
                      <input className={fieldClass} value={item.category} onChange={(event) => updateItem(item.id, { category: event.target.value })} />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Description</span>
                      <input className={fieldClass} value={item.alt} onChange={(event) => updateItem(item.id, { alt: event.target.value })} />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e6e8f0] px-3 py-2 text-xs font-semibold text-[#1d1e2c]">
                      {uploading === item.id ? 'Uploading…' : 'Replace image'}
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => onFile(event, item.id)} />
                    </label>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#ff6b81]"
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, gallery: (prev.gallery ?? []).filter((photo) => photo.id !== item.id) }));
                        onNotice('Photo removed. Choose Save changes to update the public gallery.');
                      }}
                      data-testid={`button-gallery-delete-${item.id}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminApp() {
  const { content, reload, publishLocal, source } = useSiteContent();

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      robots?.setAttribute('content', 'index, follow');
    };
  }, []);
  const [draft, setDraft] = useState<SiteContent>(content);
  const [section, setSection] = useState<SectionId>('overview');
  const [authenticated, setAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('admin@creationcare.org');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [messages, setMessages] = useState<Array<Record<string, unknown>>>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [messageFilter, setMessageFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState<Record<string, unknown> | null>(null);
  const [payoutName, setPayoutName] = useState('');
  const [payoutPhone, setPayoutPhone] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('1000');
  const [payoutProvider, setPayoutProvider] = useState('63510');
  const [payoutNote, setPayoutNote] = useState<string | null>(null);

  const unreadCount = Number((stats as { messages?: { unread?: number } })?.messages?.unread ?? 0);
  const contacts = messages.map(savedContact);
  const selectedContact = contacts.find((person) => person.id === selectedContactId) ?? contacts[0] ?? null;
  const activeNav = allNavItems.find((item) => item.id === section);

  const previewHref: Record<SectionId, string> = {
    overview: '/',
    blog: '/blog',
    gallery: '/gallery',
    programs: '/programs',
    team: '/team',
    home: '/',
    about: '/about',
    involve: '/get-involved',
    donate: '/donate',
    contact: '/contact',
    social: '/',
    messages: '/contact',
    engagement: '/',
    wallet: '/donate',
  };

  const goToSection = (id: SectionId) => {
    setSection(id);
    setEditingSlug(null);
    setSidebarOpen(false);
  };

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    void (async () => {
      const me = await adminMe();
      setAuthenticated(me.authenticated);
      if (me.admin?.name) setAdminName(me.admin.name);
      setChecking(false);
    })();
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void (async () => {
      try {
        const response = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
        setApiOnline(response.ok);
      } catch {
        setApiOnline(false);
      }
      const result = await fetchDashboardStats();
      if (result.ok) setStats(result.stats);
      const inbox = await fetchMessages(messageFilter, search);
      if (inbox.ok) setMessages(inbox.messages);
    })();
  }, [authenticated, messageFilter, search, section]);

  useEffect(() => {
    if (!authenticated || section !== 'wallet') return;
    void (async () => {
      const result = await fetchWallet();
      if (result.ok) setWallet(result.wallet);
      else setPayoutNote(result.error);
    })();
  }, [authenticated, section]);

  const editingPost = useMemo(
    () => draft.blogPosts.find((post) => post.slug === editingSlug) ?? null,
    [draft.blogPosts, editingSlug],
  );

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return draft.blogPosts;
    return draft.blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q),
    );
  }, [draft.blogPosts, search]);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    const result = await adminLogin(password, email);
    if (!result.ok) {
      setLoginError(result.error ?? 'Login failed');
      return;
    }
    setAuthenticated(true);
    if (result.admin?.name) setAdminName(result.admin.name);
    setPassword('');
  };

  const onLogout = async () => {
    await adminLogout();
    setAuthenticated(false);
  };

  const onSave = async () => {
    setSaving(true);
    setStatus(null);
    const result = await adminSaveContent(draft);
    setSaving(false);
    if (!result.ok) {
      setStatus(result.error ?? 'Save failed — is the backend running on port 4000?');
      setApiOnline(false);
      return;
    }
    const saved = result.content ?? draft;
    setDraft(saved);
    publishLocal(saved);
    await reload();
    setApiOnline(true);
    setStatus(`Saved to MySQL (v${saved.version}). Public website updated — open preview to verify.`);
    const refreshed = await fetchDashboardStats();
    if (refreshed.ok) setStats(refreshed.stats);
  };

  const updatePost = (slug: string, updater: (post: BlogPost) => BlogPost) => {
    setDraft((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.map((post) => (post.slug === slug ? updater(post) : post)),
    }));
  };

  if (checking) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#f4f5f8] text-sm text-[#1d1e2c]">
        Loading admin…
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#f4f5f8] px-5">
        <form
          onSubmit={onLogin}
          className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-8 shadow-[0_20px_60px_rgba(29,30,44,0.08)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6c5ce7] text-white">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6c5ce7]">CCF Admin</p>
              <h1 className="text-2xl font-bold tracking-tight text-[#1d1e2c]">Sign in</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#6b7280]">Manage website content, blog posts, and inbox messages.</p>
          <label className="mt-8 block">
            <span className={labelClass}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block">
            <span className={labelClass}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
              autoComplete="current-password"
              data-testid="input-admin-password"
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-[#ff6b81]">{loginError}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#6c5ce7] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,92,231,0.35)]"
            data-testid="button-admin-login"
          >
            Continue
          </button>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#6c5ce7]">
            <ArrowLeft size={14} /> Back to website
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell min-h-[100dvh] bg-[#f4f5f8] text-[#1d1e2c]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[#1d1e2c]/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#e8eaf2] bg-white transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px]'} w-[280px]`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#e8eaf2] px-4 py-4">
          <div className={`flex min-w-0 items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6c5ce7] text-white shadow-[0_8px_20px_rgba(108,92,231,0.35)]">
              <LayoutDashboard size={18} />
          </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 lg:block">
                <p className="truncate text-sm font-bold tracking-tight">CCF Admin</p>
                <p className="truncate text-[11px] text-[#6b7280]">Control panel</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-[#6b7280] hover:bg-[#f4f5f8] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sidebar">
          {sidebarGroups.map((group) => (
            <div key={group.title} className="mb-5">
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#9ca3af]">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = section === item.id;
                  const badge =
                    item.badgeKey === 'messages' && unreadCount > 0 ? unreadCount : null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.label}
                      onClick={() => goToSection(item.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        active
                          ? 'bg-[#6c5ce7] text-white shadow-[0_10px_24px_rgba(108,92,231,0.28)]'
                          : 'text-[#4b5563] hover:bg-[#f4f5f8] hover:text-[#1d1e2c]'
                      } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      data-testid={`button-admin-nav-${item.id}`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!sidebarCollapsed && badge !== null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            active ? 'bg-white/20 text-white' : 'bg-[#ff6b81]/15 text-[#ff6b81]'
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#e8eaf2] p-3">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="mb-2 hidden w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[#4b5563] hover:bg-[#f4f5f8] lg:flex"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <Link
            href="/"
            className={`mb-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[#4b5563] hover:bg-[#f4f5f8] ${
              sidebarCollapsed ? 'lg:justify-center' : ''
            }`}
            title="View website"
          >
            <ExternalLink size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>View website</span>}
            </Link>
            <button
              type="button"
              onClick={() => void onLogout()}
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[#ff6b81] hover:bg-[#ff6b81]/10 ${
              sidebarCollapsed ? 'lg:justify-center' : ''
            }`}
            title="Log out"
          >
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
          {!sidebarCollapsed && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#f4f5f8] px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6c5ce7] text-sm font-bold text-white">
                {adminName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{adminName}</p>
                <p className="truncate text-[11px] text-[#6b7280]">Administrator</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main column */}
      <div
        className={`min-h-[100dvh] transition-[padding] duration-300 ${
          sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-[#e8eaf2] bg-[#f4f5f8]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-[#e6e8f0] bg-white p-2.5 text-[#1d1e2c] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                data-testid="button-admin-sidebar"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#6c5ce7]">
                  Admin control
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {activeNav?.label ?? 'Overview'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="hidden rounded-full border border-[#e6e8f0] bg-white p-2.5 text-[#6b7280] sm:inline-flex">
                <Bell size={16} />
              </button>
              <button type="button" className="hidden rounded-full border border-[#e6e8f0] bg-white p-2.5 text-[#6b7280] sm:inline-flex">
                <Settings size={16} />
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#6c5ce7] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,92,231,0.35)] disabled:opacity-60 sm:px-5"
              data-testid="button-admin-save"
            >
                <Save size={15} />
                <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save changes'}</span>
            </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6c5ce7] text-sm font-bold text-white lg:hidden">
                {adminName.slice(0, 1).toUpperCase()}
              </div>
          </div>
        </div>
      </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-[#6b7280]">
              Edit content here, then <strong className="font-semibold text-[#1d1e2c]">Save changes</strong>. The
              public website reads the same MySQL content live.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  apiOnline === false
                    ? 'bg-[#ff6b81]/15 text-[#ff6b81]'
                    : apiOnline
                      ? 'bg-[#1dd1a1]/15 text-[#0f8f6f]'
                      : 'bg-[#e6e8f0] text-[#6b7280]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    apiOnline === false ? 'bg-[#ff6b81]' : apiOnline ? 'bg-[#1dd1a1]' : 'bg-[#9ca3af]'
                  }`}
                />
                {apiOnline === false ? 'API offline' : apiOnline ? `API online · ${source}` : 'Checking API…'}
              </span>
              <Link
                href={previewHref[section]}
                className="inline-flex items-center gap-2 rounded-full border border-[#e6e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1e2c]"
                data-testid="link-admin-preview"
              >
                <ExternalLink size={13} /> Preview page
              </Link>
            </div>
          </div>

        {status && (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#6c5ce7]/20 bg-[#6c5ce7]/10 px-4 py-3 text-sm text-[#1d1e2c] sm:flex-row sm:items-center sm:justify-between">
            <p>{status}</p>
            <Link
              href={previewHref[section]}
              className="inline-flex items-center gap-2 rounded-full bg-[#6c5ce7] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Open live page <ExternalLink size={13} />
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Blog articles" value={Number((stats as { blogPosts?: number })?.blogPosts ?? draft.blogPosts.length)} hint="Published stories" tone="purple">
            <BookOpen className="absolute right-4 top-4 text-[#6c5ce7]/40" size={28} />
          </MetricCard>
          <MetricCard label="Programs" value={Number((stats as { programs?: number })?.programs ?? draft.programs.length)} hint="Active ministry areas" tone="sky">
            <FolderKanban className="absolute right-4 top-4 text-[#54a0ff]/50" size={28} />
          </MetricCard>
          <MetricCard label="Team roles" value={Number((stats as { teamRoles?: number })?.teamRoles ?? draft.teamRoles.length)} hint="Leadership posts" tone="emerald">
            <Users className="absolute right-4 top-4 text-[#1dd1a1]/50" size={28} />
          </MetricCard>
          <MetricCard
            label="Unread messages"
            value={unreadCount}
            hint="Inbox needing review"
            tone="rose"
          >
            <Mail className="absolute right-4 top-4 text-[#ff6b81]/50" size={28} />
          </MetricCard>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#e6e8f0] bg-white p-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles or people who contacted you…"
              className="w-full rounded-xl border border-[#e6e8f0] bg-[#f8f9fc] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#6c5ce7]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b7280]">
            <CalendarDays size={14} />
            Content v{draft.version}
          </div>
        </div>

        {section === 'overview' && (
          <>
          <OverviewCharts stats={stats} />
          <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[1.75rem] bg-[#1d1e2c] p-6 text-white shadow-[0_20px_50px_rgba(29,30,44,0.25)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Recent articles</h2>
              <button
                  type="button"
                  onClick={() => setSection('blog')}
                  className="rounded-full bg-[#6c5ce7] px-3 py-1.5 text-xs font-semibold"
                >
                  Manage blog
                </button>
              </div>
              <div className="mt-5 space-y-2">
                {draft.blogPosts.slice(0, 5).map((post) => (
                  <button
                    key={post.slug}
                type="button"
                onClick={() => {
                      setSection('blog');
                      setEditingSlug(post.slug);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left hover:bg-[#6c5ce7]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{post.title}</p>
                      <p className="text-xs text-white/50">
                        {post.category} · {post.date}
                      </p>
                    </div>
                    <FileText size={16} className="shrink-0 text-white/40" />
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6 shadow-[0_10px_40px_rgba(29,30,44,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">People who contacted you</h2>
                <button
                  type="button"
                  onClick={() => setSection('messages')}
                  className="rounded-full bg-[#6c5ce7] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Open contacts
                </button>
              </div>
              <div className="mt-5 space-y-2">
                {contacts.slice(0, 4).map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      setSelectedContactId(person.id);
                      setSection('messages');
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#e6e8f0] px-4 py-3 text-left hover:border-[#6c5ce7]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{person.name}</p>
                      <p className="truncate text-xs text-[#6b7280]">{person.email} · {contactWhen(person.createdAt)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${person.status === 'new' ? 'bg-[#6c5ce7]/15 text-[#6c5ce7]' : 'bg-[#f4f5f8] text-[#6b7280]'}`}>
                      {person.status}
                    </span>
                  </button>
                ))}
                {contacts.length === 0 && <p className="text-sm text-[#6b7280]">No one has sent a contact message yet.</p>}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6 shadow-[0_10px_40px_rgba(29,30,44,0.06)] lg:col-span-2">
              <h2 className="text-lg font-semibold">Site contact</h2>
              <div className="mt-5 space-y-4 text-sm">
                <p className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-[#6c5ce7]" />
                  <span>
                    {draft.contact.phonePrimary}
                    <br />
                    {draft.contact.phoneSecondary}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-[#6c5ce7]" />
                  {draft.contact.email}
                </p>
                <p className="flex items-start gap-3">
                  <Share2 size={16} className="mt-0.5 text-[#6c5ce7]" />
                  {draft.socialLinks.length} social channels
                </p>
                <p className="flex items-start gap-3">
                  <HeartHandshake size={16} className="mt-0.5 text-[#6c5ce7]" />
                  {draft.programs.length} programs published
                </p>
              </div>
            </div>
          </section>
          </>
        )}

        {section === 'blog' && (
          <section className="mt-6 overflow-hidden rounded-[1.75rem] bg-[#1d1e2c] text-white shadow-[0_20px_50px_rgba(29,30,44,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex gap-2">
                <span className="rounded-full bg-[#6c5ce7] px-3 py-1.5 text-xs font-semibold">All posts</span>
                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60">
                  {filteredPosts.length} articles
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const post = emptyPost();
                  setDraft((prev) => ({ ...prev, blogPosts: [post, ...prev.blogPosts] }));
                  setEditingSlug(post.slug);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#6c5ce7] px-4 py-2 text-xs font-semibold"
              >
                <Plus size={14} /> Create article
              </button>
            </div>
            <div className="grid lg:grid-cols-[340px_1fr]">
              <div className="max-h-[640px] overflow-y-auto border-b border-white/10 p-3 lg:border-b-0 lg:border-r">
                {filteredPosts.map((post) => (
                  <button
                    key={post.slug}
                    type="button"
                    onClick={() => setEditingSlug(post.slug)}
                    className={`mb-2 flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      editingSlug === post.slug ? 'bg-[#6c5ce7]' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      {post.cover.src ? (
                        <img src={post.cover.src} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{post.title}</p>
                      <p className="mt-1 text-[11px] text-white/55">
                        {post.category} · {post.date}
                        {post.content.some((block) => block.type === 'video' && block.url.trim()) ? ' · Video' : ''}
                      </p>
                    </div>
              </button>
            ))}
              </div>
              <div className="p-5 sm:p-6">
                {!editingPost ? (
                  <p className="text-sm text-white/60">Select an article to edit, or create a new one.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#a29bfe]">Editing</p>
                        <h2 className="mt-1 text-2xl font-bold">{editingPost.title || 'Untitled'}</h2>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-[#ff6b81]"
                        onClick={() => {
                          setDraft((prev) => ({
                            ...prev,
                            blogPosts: prev.blogPosts.filter((p) => p.slug !== editingPost.slug),
                          }));
                          setEditingSlug(null);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ['title', 'Title'],
                          ['slug', 'Slug'],
                          ['date', 'Date'],
                          ['category', 'Category'],
                          ['accent', 'Accent'],
                        ] as const
                      ).map(([key, label]) => (
                        <label key={key} className="block">
                          <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-white/45">{label}</span>
                          <input
                            className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[#6c5ce7]"
                            value={editingPost[key]}
                            onChange={(event) =>
                              updatePost(editingPost.slug, (post) => ({ ...post, [key]: event.target.value }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <label className="block">
                      <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-white/45">Excerpt</span>
                      <textarea
                        rows={2}
                        className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[#6c5ce7]"
                        value={editingPost.excerpt}
                        onChange={(event) =>
                          updatePost(editingPost.slug, (post) => ({ ...post, excerpt: event.target.value }))
                        }
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-white/45">Cover image URL</span>
                        <input
                          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[#6c5ce7]"
                          value={editingPost.cover.src}
                          onChange={(event) =>
                            updatePost(editingPost.slug, (post) => ({
                              ...post,
                              cover: { ...post.cover, src: event.target.value },
                            }))
                          }
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-white/45">Cover alt text</span>
                        <input
                          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[#6c5ce7]"
                          value={editingPost.cover.alt}
                          onChange={(event) =>
                            updatePost(editingPost.slug, (post) => ({
                              ...post,
                              cover: { ...post.cover, alt: event.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Article body</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold"
                            onClick={() =>
                              updatePost(editingPost.slug, (post) => ({
                                ...post,
                                content: [...post.content, { type: 'paragraph', text: '' }],
                              }))
                            }
                          >
                            + Paragraph
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold"
                            onClick={() =>
                              updatePost(editingPost.slug, (post) => ({
                                ...post,
                                content: [...post.content, { type: 'image', src: '', alt: '', caption: '' }],
                              }))
                            }
                          >
                            + Image
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold"
                            onClick={() =>
                              updatePost(editingPost.slug, (post) => ({
                                ...post,
                                content: [...post.content, { type: 'video', url: '', caption: '' }],
                              }))
                            }
                          >
                            <Video size={12} /> + Video
                          </button>
                        </div>
                      </div>
                      {editingPost.content.map((block, index) => (
                        <div key={`${editingPost.slug}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#a29bfe]">
                              {block.type}
                            </span>
                            <button
                              type="button"
                              className="text-[#ff6b81]"
                              onClick={() =>
                                updatePost(editingPost.slug, (post) => ({
                                  ...post,
                                  content: post.content.filter((_, i) => i !== index),
                                }))
                              }
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {block.type === 'paragraph' ? (
                            <textarea
                              rows={3}
                              className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                              value={block.text}
                              onChange={(event) =>
                                updatePost(editingPost.slug, (post) => {
                                  const content = [...post.content] as BlogContentBlock[];
                                  content[index] = { type: 'paragraph', text: event.target.value };
                                  return { ...post, content };
                                })
                              }
                            />
                          ) : block.type === 'video' ? (
                            <div className="grid gap-2">
                              <input
                                placeholder="Paste a YouTube, Vimeo, or video file link"
                                className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                                value={block.url}
                                onChange={(event) =>
                                  updatePost(editingPost.slug, (post) => {
                                    const content = [...post.content] as BlogContentBlock[];
                                    const current = content[index];
                                    if (current.type !== 'video') return post;
                                    content[index] = { ...current, url: event.target.value };
                                    return { ...post, content };
                                  })
                                }
                              />
                              <input
                                placeholder="Caption"
                                className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                                value={block.caption ?? ''}
                                onChange={(event) =>
                                  updatePost(editingPost.slug, (post) => {
                                    const content = [...post.content] as BlogContentBlock[];
                                    const current = content[index];
                                    if (current.type !== 'video') return post;
                                    content[index] = { ...current, caption: event.target.value };
                                    return { ...post, content };
                                  })
                                }
                              />
                              <p className="text-[11px] leading-relaxed text-white/50">
                                Copy the video address and paste it here. YouTube and Vimeo play inside the article. A direct .mp4, .webm, or .ogg file uses the video player.
                              </p>
                              {block.url.trim() ? (
                                <div className="overflow-hidden rounded-xl bg-black">
                                  {(() => {
                                    const video = resolveVideoLink(block.url);
                                    if (video.kind === 'embed') {
                                      return (
                                        <iframe
                                          src={video.src}
                                          title="Video preview"
                                          className="aspect-video w-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      );
                                    }
                                    if (video.kind === 'file') {
                                      return <video src={video.src} controls className="aspect-video w-full" />;
                                    }
                                    if (video.kind === 'link') {
                                      return <p className="px-3 py-4 text-xs text-white/70">This link will open in a new tab on the article.</p>;
                                    }
                                    return <p className="px-3 py-4 text-xs text-[#ffb4b4]">Paste a full video link, starting with https://</p>;
                                  })()}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="grid gap-2">
                              <input
                                placeholder="Image URL"
                                className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                                value={block.src}
                                onChange={(event) =>
                                  updatePost(editingPost.slug, (post) => {
                                    const content = [...post.content] as BlogContentBlock[];
                                    const current = content[index];
                                    if (current.type !== 'image') return post;
                                    content[index] = { ...current, src: event.target.value };
                                    return { ...post, content };
                                  })
                                }
                              />
                              <input
                                placeholder="Alt text"
                                className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                                value={block.alt}
                                onChange={(event) =>
                                  updatePost(editingPost.slug, (post) => {
                                    const content = [...post.content] as BlogContentBlock[];
                                    const current = content[index];
                                    if (current.type !== 'image') return post;
                                    content[index] = { ...current, alt: event.target.value };
                                    return { ...post, content };
                                  })
                                }
                              />
                              <input
                                placeholder="Caption"
                                className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                                value={block.caption ?? ''}
                                onChange={(event) =>
                                  updatePost(editingPost.slug, (post) => {
                                    const content = [...post.content] as BlogContentBlock[];
                                    const current = content[index];
                                    if (current.type !== 'image') return post;
                                    content[index] = { ...current, caption: event.target.value };
                                    return { ...post, content };
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {section === 'gallery' && (
          <GalleryEditor
            draft={draft}
            setDraft={setDraft}
            onNotice={setStatus}
          />
        )}

        {section === 'messages' && (
          <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#e6e8f0] bg-white shadow-[0_10px_40px_rgba(29,30,44,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e8f0] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold">Saved contacts</h2>
                <p className="mt-1 text-sm text-[#6b7280]">People who wrote through the contact form.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'new', 'read', 'archived'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMessageFilter(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      messageFilter === item ? 'bg-[#6c5ce7] text-white' : 'bg-[#f4f5f8] text-[#6b7280]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {contacts.length === 0 ? (
              <p className="p-8 text-sm text-[#6b7280]">No saved contacts yet. Messages from the website contact form appear here.</p>
            ) : (
              <div className="grid lg:grid-cols-[340px_1fr]">
                <div className="max-h-[720px] overflow-y-auto border-b border-[#e6e8f0] lg:border-b-0 lg:border-r">
                  {contacts.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => {
                        setSelectedContactId(person.id);
                        if (person.status !== 'new') return;
                        void updateMessageStatus(person.id, 'read').then(async () => {
                          setMessages((prev) =>
                            prev.map((row) => (Number(row.id) === person.id ? { ...row, status: 'read' } : row)),
                          );
                          const refreshed = await fetchDashboardStats();
                          if (refreshed.ok) setStats(refreshed.stats);
                        });
                      }}
                      className={`flex w-full items-start gap-3 border-b border-[#e6e8f0] px-4 py-4 text-left ${
                        selectedContact?.id === person.id ? 'bg-[#6c5ce7]/10' : 'hover:bg-[#f8f9fc]'
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6c5ce7] text-sm font-bold text-white">
                        {person.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">{person.name}</span>
                          {person.status === 'new' && <span className="h-2 w-2 shrink-0 rounded-full bg-[#6c5ce7]" />}
                        </span>
                        <span className="mt-1 block truncate text-xs text-[#6b7280]">{person.subject || 'No subject'}</span>
                        <span className="mt-1 block text-[11px] text-[#9ca3af]">{contactWhen(person.createdAt)}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {selectedContact && (
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#6c5ce7]">{selectedContact.status}</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">{selectedContact.name}</h3>
                        <p className="mt-2 text-sm text-[#6b7280]">{contactWhen(selectedContact.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(`Re: ${selectedContact.subject || 'Your message to Creation Care Foundation'}`)}`}
                          className="rounded-full bg-[#6c5ce7] px-4 py-2 text-xs font-semibold text-white"
                        >
                          Reply by email
                        </a>
                        {selectedContact.status !== 'read' && (
                          <button
                            type="button"
                            className="rounded-full border border-[#e6e8f0] px-4 py-2 text-xs font-semibold"
                            onClick={() =>
                              void updateMessageStatus(selectedContact.id, 'read').then(async () => {
                                const inbox = await fetchMessages(messageFilter, search);
                                if (inbox.ok) setMessages(inbox.messages);
                              })
                            }
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          className="rounded-full border border-[#e6e8f0] px-4 py-2 text-xs font-semibold"
                          onClick={() =>
                            void updateMessageStatus(selectedContact.id, selectedContact.status === 'archived' ? 'read' : 'archived').then(async () => {
                              const inbox = await fetchMessages(messageFilter, search);
                              if (inbox.ok) setMessages(inbox.messages);
                              const refreshed = await fetchDashboardStats();
                              if (refreshed.ok) setStats(refreshed.stats);
                            })
                          }
                        >
                          {selectedContact.status === 'archived' ? 'Restore' : 'Archive'}
                        </button>
                      </div>
                    </div>
                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#f8f9fc] px-4 py-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b7280]">Email</dt>
                        <dd className="mt-1 break-all text-sm font-semibold">{selectedContact.email}</dd>
                      </div>
                      <div className="rounded-2xl bg-[#f8f9fc] px-4 py-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b7280]">Phone</dt>
                        <dd className="mt-1 text-sm font-semibold">{selectedContact.phone || 'No phone given'}</dd>
                      </div>
                      <div className="rounded-2xl bg-[#f8f9fc] px-4 py-3 sm:col-span-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b7280]">Subject</dt>
                        <dd className="mt-1 text-sm font-semibold">{selectedContact.subject || 'No subject'}</dd>
                      </div>
                    </dl>
                    <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-[#1d1e2c]">{selectedContact.message}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

          {section === 'contact' && (
          <section className="mt-6 rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6 shadow-[0_10px_40px_rgba(29,30,44,0.06)]">
            <h2 className="text-2xl font-bold">Contact information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ['address', 'Address'],
                  ['email', 'Email'],
                  ['phonePrimary', 'Primary phone'],
                  ['phoneSecondary', 'Secondary phone'],
                  ['phonePrimaryTel', 'Primary tel (digits)'],
                  ['phoneSecondaryTel', 'Secondary tel (digits)'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className={labelClass}>{label}</span>
                  <input
                    className={fieldClass}
                    value={draft.contact[key]}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </section>
          )}

          {section === 'social' && (
          <section className="mt-6 rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Social links</h2>
                <button
                  type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#6c5ce7] px-4 py-2 text-xs font-semibold text-white"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                    socialLinks: [...prev.socialLinks, { label: 'New link', href: 'https://', icon: 'facebook' }],
                    }))
                  }
                >
                <Plus size={14} /> Add link
                </button>
              </div>
            <div className="mt-5 space-y-3">
              {draft.socialLinks.map((link, index) => (
                <div key={`${link.label}-${index}`} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4 sm:grid-cols-[1fr_1fr_140px_auto]">
                    <input
                      className={fieldClass}
                      value={link.label}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const socialLinks = [...prev.socialLinks];
                          socialLinks[index] = { ...socialLinks[index], label: event.target.value };
                          return { ...prev, socialLinks };
                        })
                      }
                    />
                    <input
                      className={fieldClass}
                      value={link.href}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const socialLinks = [...prev.socialLinks];
                          socialLinks[index] = { ...socialLinks[index], href: event.target.value };
                          return { ...prev, socialLinks };
                        })
                      }
                    />
                    <select
                      className={fieldClass}
                      value={link.icon}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const socialLinks = [...prev.socialLinks];
                          socialLinks[index] = {
                            ...socialLinks[index],
                            icon: event.target.value as SocialLink['icon'],
                          };
                          return { ...prev, socialLinks };
                        })
                      }
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  <button
                    type="button"
                    className="rounded-2xl border border-[#ff6b81]/30 px-3 text-[#ff6b81]"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        socialLinks: prev.socialLinks.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(section === 'home' || section === 'about' || section === 'donate' || section === 'involve') && (
          <section className="mt-6 rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
            <h2 className="text-2xl font-bold capitalize">{section} page copy</h2>
            <p className="mt-2 text-sm text-[#6b7280]">Edit key text blocks shown on the public website.</p>
            <div className="mt-5 grid gap-4">
              {section === 'home' &&
                (
                  [
                    ['heroEyebrow', 'Hero eyebrow'],
                    ['heroTitleLine1', 'Hero title line 1'],
                    ['heroTitleEmphasis', 'Hero emphasis'],
                    ['heroTitleLine2', 'Hero title line 2'],
                    ['heroCopy', 'Hero copy'],
                    ['beliefTitle', 'Belief title'],
                    ['beliefCopy', 'Belief copy'],
                    ['visionTitle', 'Vision title'],
                    ['visionCopy', 'Vision copy'],
                    ['missionTitle', 'Mission title'],
                    ['missionCopy', 'Mission copy'],
                    ['programsTitle', 'Programs title'],
                    ['blogTitle', 'Blog title'],
                    ['ctaTitle', 'CTA title'],
                    ['ctaCopy', 'CTA copy'],
                  ] as const
                ).map(([key, label]) => (
                <label key={key} className="block">
                    <span className={labelClass}>{label}</span>
                  <textarea
                      rows={key.toLowerCase().includes('copy') ? 3 : 2}
                      className={fieldClass}
                    value={draft.home[key]}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        home: { ...prev.home, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
              ))}

          {section === 'about' && (
                <>
                  {(
                    [
                      ['believeTitle', draft.about.believeTitle],
                      ['believeLead', draft.about.believeLead],
                      ['believeBody', draft.about.believeBody],
                      ['visionTitle', draft.about.visionTitle],
                      ['visionCopy', draft.about.visionCopy],
                      ['missionTitle', draft.about.missionTitle],
                      ['missionCopy', draft.about.missionCopy],
                    ] as const
                  ).map(([key, value]) => (
                <label key={key} className="block">
                      <span className={labelClass}>{key}</span>
                  <textarea
                        rows={3}
                        className={fieldClass}
                        value={value}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                            about: { ...prev.about, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
              ))}
                </>
              )}

              {section === 'donate' &&
                (
                  [
                    ['whyTitle', 'Why title'],
                    ['whyLead', 'Why lead'],
                    ['paymentNote', 'Payment note'],
                    ['momoHint', 'MoMo hint'],
                    ['airtelHint', 'Airtel hint'],
                    ['cardHint', 'Card hint'],
                ] as const
                ).map(([key, label]) => (
                <label key={key} className="block">
                    <span className={labelClass}>{label}</span>
                  <textarea
                      rows={2}
                      className={fieldClass}
                      value={draft.donate[key]}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                          donate: { ...prev.donate, [key]: event.target.value },
                      }))
                    }
                  />
                </label>
                ))}

              {section === 'involve' && (
                <div className="space-y-3">
                  {draft.involveWays.map((way, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4">
                      <input
                        className={fieldClass}
                        value={way.title}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const involveWays = [...prev.involveWays];
                            involveWays[index] = { ...involveWays[index], title: event.target.value };
                            return { ...prev, involveWays };
                          })
                        }
                      />
                      <textarea
                        rows={2}
                        className={fieldClass}
                        value={way.copy}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const involveWays = [...prev.involveWays];
                            involveWays[index] = { ...involveWays[index], copy: event.target.value };
                            return { ...prev, involveWays };
                          })
                        }
                      />
                    </div>
              ))}
            </div>
              )}
            </div>
          </section>
          )}

          {section === 'programs' && (
          <section className="mt-6 rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Programs</h2>
              <button
                type="button"
                className="rounded-full bg-[#6c5ce7] px-4 py-2 text-xs font-semibold text-white"
                onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                    programs: [
                      ...prev.programs,
                      {
                        id: `program-${Date.now()}`,
                        number: String(prev.programs.length + 1).padStart(2, '0'),
                        icon: 'Leaf',
                        category: 'Program',
                        title: 'New program',
                        copy: '',
                        accent: 'teal',
                      },
                    ],
                  }))
                }
              >
                + Add program
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {draft.programs.map((program, index) => (
                <div key={program.id} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4 sm:grid-cols-2">
                      <input
                        className={fieldClass}
                        value={program.title}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const programs = [...prev.programs];
                            programs[index] = { ...programs[index], title: event.target.value };
                            return { ...prev, programs };
                          })
                        }
                      />
                      <input
                        className={fieldClass}
                        value={program.category}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const programs = [...prev.programs];
                            programs[index] = { ...programs[index], category: event.target.value };
                            return { ...prev, programs };
                          })
                        }
                      />
                      <textarea
                    rows={3}
                    className={`${fieldClass} sm:col-span-2`}
                        value={program.copy}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const programs = [...prev.programs];
                            programs[index] = { ...programs[index], copy: event.target.value };
                            return { ...prev, programs };
                          })
                        }
                      />
                  <button
                    type="button"
                    className="sm:col-span-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#ff6b81]/30 px-3 py-2 text-xs font-semibold text-[#ff6b81]"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        programs: prev.programs.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
          )}

          {section === 'team' && (
          <section className="mt-6 rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
            <h2 className="text-2xl font-bold">Team roles</h2>
            <div className="mt-5 space-y-3">
              {draft.teamRoles.map((role, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4">
                      <input
                        className={fieldClass}
                        value={role.title}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const teamRoles = [...prev.teamRoles];
                            teamRoles[index] = { ...teamRoles[index], title: event.target.value };
                            return { ...prev, teamRoles };
                          })
                        }
                      />
                      <textarea
                    rows={2}
                    className={fieldClass}
                        value={role.copy}
                        onChange={(event) =>
                          setDraft((prev) => {
                            const teamRoles = [...prev.teamRoles];
                            teamRoles[index] = { ...teamRoles[index], copy: event.target.value };
                            return { ...prev, teamRoles };
                          })
                        }
                      />
                  </div>
              ))}
            </div>
          </section>
        )}

        {section === 'wallet' && (
          <section className="mt-6 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-[1.75rem] bg-[#1d1e2c] p-6 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#a29bfe]">Available to withdraw</p>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {Number((wallet?.balance as { available?: number } | undefined)?.available ?? 0).toLocaleString()} RWF
                </p>
                <p className="mt-3 text-sm text-white/60">
                  Collected {Number((wallet?.balance as { collected?: number } | undefined)?.collected ?? 0).toLocaleString()} RWF
                  · Reserved {Number((wallet?.balance as { reserved?: number } | undefined)?.reserved ?? 0).toLocaleString()} RWF
                </p>
                <p className="mt-4 text-xs leading-relaxed text-white/55">
                  This balance is successful live gifts minus payouts that are pending or already sent. XentriPay holds each payout until the business OTP is confirmed.
                  {' '}
                  {wallet?.configured
                    ? 'Production gateway is connected at https://xentripay.com.'
                    : 'Add XENTRIPAY_API_KEY in backend/.env before gifts or payouts can go through.'}
                </p>
              </div>
              <form
                className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  void (async () => {
                    setPayoutNote(null);
                    const result = await createPayout({
                      providerId: payoutProvider,
                      name: payoutName,
                      phone: payoutPhone,
                      amount: Math.round(Number(payoutAmount)),
                    });
                    setPayoutNote(result.ok ? result.message : result.error);
                    const refreshed = await fetchWallet();
                    if (refreshed.ok) setWallet(refreshed.wallet);
                  })();
                }}
              >
                <h2 className="text-2xl font-bold">Withdraw / payout</h2>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Sends money from the available balance. XentriPay then emails or texts an OTP to the registered business contact. The payout stays pending until that OTP is confirmed.
                </p>
                <label className="mt-4 block">
                  <span className={labelClass}>Provider</span>
                  <select className={fieldClass} value={payoutProvider} onChange={(event) => setPayoutProvider(event.target.value)}>
                    {((wallet?.providers as Array<{ id: string; name: string }> | undefined) ?? [
                      { id: '63510', name: 'MTN Mobile Money' },
                      { id: '63514', name: 'Airtel Rwanda' },
                    ]).map((provider) => (
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-3 block">
                  <span className={labelClass}>Recipient name</span>
                  <input className={fieldClass} value={payoutName} onChange={(event) => setPayoutName(event.target.value)} required />
                </label>
                <label className="mt-3 block">
                  <span className={labelClass}>Phone (078…)</span>
                  <input className={fieldClass} value={payoutPhone} onChange={(event) => setPayoutPhone(event.target.value)} required placeholder="0788123456" />
                </label>
                <label className="mt-3 block">
                  <span className={labelClass}>Amount (RWF)</span>
                  <input className={fieldClass} type="number" min="100" step="1" value={payoutAmount} onChange={(event) => setPayoutAmount(event.target.value)} required />
                </label>
                {payoutNote && <p className="mt-3 text-sm text-[#6c5ce7]">{payoutNote}</p>}
                <button type="submit" className="mt-5 rounded-full bg-[#6c5ce7] px-5 py-3 text-sm font-semibold text-white">
                  Send payout
                  </button>
              </form>
            </div>
            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <h2 className="text-xl font-bold">Recent gifts</h2>
              <div className="mt-4 divide-y divide-[#e6e8f0]">
                {((wallet?.collections as Array<Record<string, unknown>>) ?? []).map((item) => (
                  <div key={String(item.customerRef)} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span>{String(item.donorName)} · {String(item.method)}</span>
                    <span className="font-semibold">{Number(item.amount).toLocaleString()} RWF · {String(item.status)}</span>
                </div>
              ))}
                {((wallet?.collections as unknown[]) ?? []).length === 0 && <p className="py-3 text-sm text-[#6b7280]">No live gifts yet.</p>}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <h2 className="text-xl font-bold">Recent payouts</h2>
              <div className="mt-4 divide-y divide-[#e6e8f0]">
                {((wallet?.payouts as Array<Record<string, unknown>>) ?? []).map((item) => (
                  <div key={String(item.customerRef)} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                    <div>
                      <p className="font-semibold">{String(item.recipientName)} · {String(item.providerName)}</p>
                      <p className="text-xs text-[#6b7280]">{String(item.customerRef)} · {String(item.status)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{Number(item.amount).toLocaleString()} RWF</span>
              <button
                type="button"
                        className="rounded-full border border-[#e6e8f0] px-3 py-1.5 text-xs font-semibold"
                        onClick={() => void refreshPayout(String(item.customerRef)).then(async () => {
                          const refreshed = await fetchWallet();
                          if (refreshed.ok) setWallet(refreshed.wallet);
                        })}
                      >
                        Refresh
              </button>
            </div>
                  </div>
                ))}
                {((wallet?.payouts as unknown[]) ?? []).length === 0 && <p className="py-3 text-sm text-[#6b7280]">No payouts yet.</p>}
              </div>
            </div>
          </section>
        )}

        {section === 'engagement' && (
          <section className="mt-6 space-y-6">
            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <h2 className="text-2xl font-bold">Impact stats</h2>
              <p className="mt-2 text-sm text-[#6b7280]">Shown on the homepage for visitors and international partners.</p>
              <div className="mt-5 space-y-3">
                {draft.impactStats.map((stat, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4 sm:grid-cols-3">
                    <input
                      className={fieldClass}
                      value={stat.value}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const impactStats = [...prev.impactStats];
                          impactStats[index] = { ...impactStats[index], value: event.target.value };
                          return { ...prev, impactStats };
                        })
                      }
                    />
                    <input
                      className={fieldClass}
                      value={stat.label}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const impactStats = [...prev.impactStats];
                          impactStats[index] = { ...impactStats[index], label: event.target.value };
                          return { ...prev, impactStats };
                        })
                      }
                    />
                    <input
                      className={fieldClass}
                      value={stat.hint}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const impactStats = [...prev.impactStats];
                          impactStats[index] = { ...impactStats[index], hint: event.target.value };
                          return { ...prev, impactStats };
                        })
                      }
                    />
                </div>
              ))}
            </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <h2 className="text-2xl font-bold">Testimonials</h2>
              <div className="mt-5 space-y-3">
                {draft.testimonials.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4">
                  <textarea
                      rows={3}
                      className={fieldClass}
                      value={item.quote}
                    onChange={(event) =>
                        setDraft((prev) => {
                          const testimonials = [...prev.testimonials];
                          testimonials[index] = { ...testimonials[index], quote: event.target.value };
                          return { ...prev, testimonials };
                        })
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        className={fieldClass}
                        value={item.name}
                    onChange={(event) =>
                          setDraft((prev) => {
                            const testimonials = [...prev.testimonials];
                            testimonials[index] = { ...testimonials[index], name: event.target.value };
                            return { ...prev, testimonials };
                          })
                        }
                      />
                      <input
                        className={fieldClass}
                        value={item.role}
                  onChange={(event) =>
                          setDraft((prev) => {
                            const testimonials = [...prev.testimonials];
                            testimonials[index] = { ...testimonials[index], role: event.target.value };
                            return { ...prev, testimonials };
                          })
                        }
                      />
                      <input
                        className={fieldClass}
                        value={item.location}
                    onChange={(event) =>
                          setDraft((prev) => {
                            const testimonials = [...prev.testimonials];
                            testimonials[index] = { ...testimonials[index], location: event.target.value };
                            return { ...prev, testimonials };
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#e6e8f0] bg-white p-6">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <div className="mt-5 space-y-3">
                {draft.faqs.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[#e6e8f0] p-4">
            <input
              className={fieldClass}
                      value={item.question}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const faqs = [...prev.faqs];
                          faqs[index] = { ...faqs[index], question: event.target.value };
                          return { ...prev, faqs };
                        })
                      }
                    />
          <textarea
                      rows={3}
            className={fieldClass}
                      value={item.answer}
                      onChange={(event) =>
                        setDraft((prev) => {
                          const faqs = [...prev.faqs];
                          faqs[index] = { ...faqs[index], answer: event.target.value };
                          return { ...prev, faqs };
                        })
                      }
                    />
        </div>
                ))}
            </div>
              </div>
          </section>
            )}
          </div>
      </div>
    </main>
  );
}
