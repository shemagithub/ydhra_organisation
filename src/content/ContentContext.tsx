import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { API_BASE, rewriteUploads } from './apiBase';
import { defaultSiteContent } from './defaults';
import type { SiteContent } from './types';

export const CONTENT_UPDATED_EVENT = 'ccf:content-updated';

type ContentContextValue = {
  content: SiteContent;
  loading: boolean;
  error: string | null;
  source: 'api' | 'json' | 'defaults';
  reload: (options?: { fresh?: boolean }) => Promise<void>;
  setContentLocal: (next: SiteContent) => void;
  publishLocal: (next: SiteContent) => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);
const CONTENT_CACHE_KEY = 'ccf-content-cache-v1';

function readStoredContent(): { etag: string; content: Partial<SiteContent> } | null {
  try {
    const raw = sessionStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { etag?: string; content?: Partial<SiteContent> };
    if (!parsed?.content || !parsed.etag) return null;
    return { etag: parsed.etag, content: parsed.content };
  } catch {
    return null;
  }
}

function writeStoredContent(etag: string, content: Partial<SiteContent>) {
  try {
    sessionStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({ etag, content }));
  } catch {
    // Ignore quota or private-mode failures.
  }
}

function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial || typeof partial !== 'object') return defaultSiteContent;
  return {
    ...defaultSiteContent,
    ...partial,
    contact: { ...defaultSiteContent.contact, ...(partial.contact ?? {}) },
    socialLinks: partial.socialLinks ?? defaultSiteContent.socialLinks,
    home: { ...defaultSiteContent.home, ...(partial.home ?? {}) },
    about: {
      ...defaultSiteContent.about,
      ...(partial.about ?? {}),
      intro: { ...defaultSiteContent.about.intro, ...(partial.about?.intro ?? {}) },
    },
    programsPage: {
      ...defaultSiteContent.programsPage,
      ...(partial.programsPage ?? {}),
      intro: { ...defaultSiteContent.programsPage.intro, ...(partial.programsPage?.intro ?? {}) },
    },
    careSchool: {
      ...defaultSiteContent.careSchool,
      ...(partial.careSchool ?? {}),
      intro: { ...defaultSiteContent.careSchool.intro, ...(partial.careSchool?.intro ?? {}) },
      reasons: partial.careSchool?.reasons ?? defaultSiteContent.careSchool.reasons,
    },
    teamPage: {
      ...defaultSiteContent.teamPage,
      ...(partial.teamPage ?? {}),
      intro: { ...defaultSiteContent.teamPage.intro, ...(partial.teamPage?.intro ?? {}) },
    },
    getInvolved: {
      ...defaultSiteContent.getInvolved,
      ...(partial.getInvolved ?? {}),
      intro: { ...defaultSiteContent.getInvolved.intro, ...(partial.getInvolved?.intro ?? {}) },
    },
    donate: {
      ...defaultSiteContent.donate,
      ...(partial.donate ?? {}),
      intro: { ...defaultSiteContent.donate.intro, ...(partial.donate?.intro ?? {}) },
    },
    contactPage: {
      ...defaultSiteContent.contactPage,
      ...(partial.contactPage ?? {}),
      intro: { ...defaultSiteContent.contactPage.intro, ...(partial.contactPage?.intro ?? {}) },
    },
    blogPage: {
      ...defaultSiteContent.blogPage,
      ...(partial.blogPage ?? {}),
      intro: { ...defaultSiteContent.blogPage.intro, ...(partial.blogPage?.intro ?? {}) },
    },
    galleryPage: {
      ...defaultSiteContent.galleryPage,
      ...(partial.galleryPage ?? {}),
      intro: { ...defaultSiteContent.galleryPage.intro, ...(partial.galleryPage?.intro ?? {}) },
    },
    gallery: partial.gallery ?? defaultSiteContent.gallery,
    impactStats: partial.impactStats ?? defaultSiteContent.impactStats,
    testimonials: partial.testimonials ?? defaultSiteContent.testimonials,
    faqs: partial.faqs ?? defaultSiteContent.faqs,
    reachAreas: partial.reachAreas ?? defaultSiteContent.reachAreas,
    programs: partial.programs ?? defaultSiteContent.programs,
    teamRoles: partial.teamRoles ?? defaultSiteContent.teamRoles,
    teamValues: partial.teamValues ?? defaultSiteContent.teamValues,
    involveWays: partial.involveWays ?? defaultSiteContent.involveWays,
    donationSupports: partial.donationSupports ?? defaultSiteContent.donationSupports,
    partnerTypes: partial.partnerTypes ?? defaultSiteContent.partnerTypes,
    blogPosts: partial.blogPosts ?? defaultSiteContent.blogPosts,
    pageMeta: { ...defaultSiteContent.pageMeta, ...(partial.pageMeta ?? {}) },
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const stored = readStoredContent();
  const [content, setContent] = useState<SiteContent>(stored ? rewriteUploads(mergeContent(stored.content)) : defaultSiteContent);
  const [loading, setLoading] = useState(!stored);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'json' | 'defaults'>(stored ? 'api' : 'defaults');
  const fetchedAt = useRef(0);

  const reload = useCallback(async (options?: { fresh?: boolean }) => {
    const fresh = options?.fresh === true;
    if (!readStoredContent()) setLoading(true);
    setError(null);
    try {
      let data: Partial<SiteContent> | null = null;
      let nextSource: 'api' | 'json' | 'defaults' = 'defaults';
      const cached = fresh ? null : readStoredContent();

      try {
        const headers: HeadersInit = {};
        if (cached?.etag) headers['If-None-Match'] = cached.etag;
        const apiResponse = await fetch(`${API_BASE}/content`, {
          credentials: 'include',
          cache: fresh ? 'reload' : 'default',
          headers,
        });
        if (apiResponse.status === 304 && cached) {
          data = cached.content;
          nextSource = 'api';
        } else if (apiResponse.ok) {
          const body = (await apiResponse.json()) as { content?: Partial<SiteContent> };
          if (body.content) {
            data = body.content;
            nextSource = 'api';
            const etag = apiResponse.headers.get('ETag');
            if (etag) writeStoredContent(etag, body.content);
          }
        }
      } catch {
        // fall through to static JSON
      }

      if (!data) {
        const response = await fetch('/content/site-content.json', {
          credentials: 'same-origin',
          cache: fresh ? 'reload' : 'default',
        });
        if (!response.ok) throw new Error(`Failed to load content (${response.status})`);
        data = (await response.json()) as Partial<SiteContent>;
        nextSource = 'json';
      }

      setContent(rewriteUploads(mergeContent(data)));
      setSource(nextSource);
      fetchedAt.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      if (!readStoredContent()) {
        setContent(defaultSiteContent);
        setSource('defaults');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const publishLocal = useCallback((next: SiteContent) => {
    setContent(rewriteUploads(mergeContent(next)));
    setSource('api');
    try {
      sessionStorage.removeItem(CONTENT_CACHE_KEY);
    } catch {
      // Ignore storage failures.
    }
    window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: next }));
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const onUpdate = () => {
      void reload({ fresh: true });
    };
    const onFocus = () => {
      const onAdmin = window.location.pathname.startsWith('/admin');
      if (onAdmin || Date.now() - fetchedAt.current > 45_000) void reload();
    };
    window.addEventListener(CONTENT_UPDATED_EVENT, onUpdate);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, onUpdate);
      window.removeEventListener('focus', onFocus);
    };
  }, [reload]);

  const value = useMemo(
    () => ({
      content,
      loading,
      error,
      source,
      reload,
      setContentLocal: setContent,
      publishLocal,
    }),
    [content, loading, error, source, reload, publishLocal],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within ContentProvider');
  return ctx;
}
