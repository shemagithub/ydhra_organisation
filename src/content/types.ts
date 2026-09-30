export type BlogImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; url: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  accent: string;
  cover: BlogImage;
  content: BlogContentBlock[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: 'facebook' | 'instagram' | 'youtube' | 'whatsapp';
};

export type ProgramItem = {
  id: string;
  number: string;
  icon: string;
  category: string;
  title: string;
  copy: string;
  accent: string;
};

export type TeamRole = {
  title: string;
  copy: string;
};

export type InvolveWay = {
  title: string;
  copy: string;
  href: string;
};

export type ImpactStat = {
  value: string;
  label: string;
  hint: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ReachArea = {
  title: string;
  copy: string;
};

export type ContactInfo = {
  address: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  phonePrimaryTel: string;
  phoneSecondaryTel: string;
};

export type PageCopy = {
  eyebrow: string;
  title: string;
  copy: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
};

export type SiteContent = {
  version: number;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  home: {
    heroEyebrow: string;
    heroTitleLine1: string;
    heroTitleEmphasis: string;
    heroTitleLine2: string;
    heroCopy: string;
    beliefTitle: string;
    beliefCopy: string;
    visionTitle: string;
    visionCopy: string;
    missionTitle: string;
    missionCopy: string;
    programsTitle: string;
    blogTitle: string;
    ctaTitle: string;
    ctaCopy: string;
    welcomeNote: string;
    impactTitle: string;
    impactCopy: string;
    reachTitle: string;
    reachCopy: string;
    voicesTitle: string;
    voicesCopy: string;
    faqTitle: string;
    faqCopy: string;
    newsletterTitle: string;
    newsletterCopy: string;
  };
  about: {
    intro: PageCopy;
    believeTitle: string;
    believeLead: string;
    believeBody: string;
    visionTitle: string;
    visionCopy: string;
    missionTitle: string;
    missionCopy: string;
    schoolTitle: string;
    schoolCopy: string;
  };
  programsPage: {
    intro: PageCopy;
  };
  careSchool: {
    intro: PageCopy;
    lead: string;
    body: string;
    reasons: string[];
  };
  teamPage: {
    intro: PageCopy;
  };
  getInvolved: {
    intro: PageCopy;
  };
  donate: {
    intro: PageCopy;
    whyTitle: string;
    whyLead: string;
    paymentNote: string;
    momoHint: string;
    airtelHint: string;
    cardHint: string;
    internationalNote: string;
  };
  contactPage: {
    intro: PageCopy;
  };
  blogPage: {
    intro: PageCopy;
  };
  galleryPage: {
    intro: PageCopy;
  };
  gallery: GalleryItem[];
  impactStats: ImpactStat[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  reachAreas: ReachArea[];
  programs: ProgramItem[];
  teamRoles: TeamRole[];
  teamValues: [string, string][];
  involveWays: InvolveWay[];
  donationSupports: string[];
  partnerTypes: string[];
  blogPosts: BlogPost[];
  pageMeta: Record<string, { title: string; description: string }>;
};
