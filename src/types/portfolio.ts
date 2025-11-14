export type AvailabilityKey = 'available' | 'listening' | 'unavailable';

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface HeroTitleSegment {
  text: string;
  accent?: 'primary' | 'secondary';
}

export interface HeroDescriptionSegment {
  text: string;
  accent?: 'gradient';
}

export type HeroMetaItem =
  | {
      label: string;
      field: 'location' | 'badge' | 'subtitle';
      value?: string;
    }
  | {
      label: string;
      value: string;
      field?: undefined;
    };

export interface FocusAreaItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface ExperienceJob {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  icon: string;
  title: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface PortfolioToasts {
  welcome?: string;
  email_copy_success: string;
  email_copy_error: string;
  whatsapp_open: string;
  availability_available: string;
  availability_listening: string;
  availability_unavailable: string;
  retro_enabled?: string;
  retro_disabled?: string;
  invalid_url?: string;
}

export interface Tooltips {
  copy?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  github?: string;
  pdf?: string;
  celebrate?: string;
  language?: string;
  theme?: string;
}

export interface UIStrings {
  viewProjects: string;
  bookCall: string;
  retroExit: string;
  retroActiveLabel: string;
  quickActionsTitle: string;
  searchAriaLabel: string;
  searchPlaceholder: string;
  noMatchesTitle: string;
  noMatchesSubtitle: string;
  quickSectionsLabel: string;
  quickPreferencesLabel: string;
  searchFilterTitle: string;
  searchFilterSubtitle: string;
  searchPlaceholderTech: string;
  searchClearLabel: string;
  searchSuggestionsAria: string;
  searchNoMatches: string;
  prevProjects: string;
  nextProjects: string;
  prevSkills: string;
  nextSkills: string;
}

export interface FocusSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: FocusAreaItem[];
}

export interface ContactSection {
  title: string;
  subtitle: string;
  closing: string;
  signature: string;
}

export interface ExperienceSection {
  title: string;
  jobs: readonly ExperienceJob[];
}

export interface SkillsSection {
  title: string;
  categories: readonly SkillCategory[];
}

export interface ProjectsSection {
  title: string;
  items: readonly ProjectItem[];
}

export interface PortfolioSections {
  experience: ExperienceSection;
  skills: SkillsSection;
  projects: ProjectsSection;
  focus: FocusSection;
  contact: ContactSection;
}

export interface HeroSection {
  eyebrow: string;
  titleSegments: HeroTitleSegment[];
  descriptionSegments: HeroDescriptionSegment[];
  status: {
    title: string;
    description: string;
  };
  meta?: HeroMetaItem[];
  note: {
    title: string;
    items: string[];
  };
  tagline?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface PortfolioData {
  lang: 'es' | 'en';
  name: string;
  title: string;
  subtitle: string;
  tagline?: string;
  description: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  social: SocialLinks;
  availability: {
    status: Record<AvailabilityKey, string>;
    toggle: Record<AvailabilityKey, string>;
  };
  badge?: string;
  nav: readonly { id: string; label: string }[];
  hero: {
    eyebrow: string;
    titleSegments: readonly HeroTitleSegment[];
    descriptionSegments: readonly HeroDescriptionSegment[];
    status: {
      title: string;
      description: string;
    };
    meta?: readonly HeroMetaItem[];
    note: {
      title: string;
      items: readonly string[];
    };
    tagline?: string;
  };
  stats: readonly Stat[];
  sections: {
    experience: ExperienceSection;
    skills: SkillsSection;
    projects: ProjectsSection;
    focus: FocusSection;
    contact: ContactSection;
  };
  tooltips: Tooltips;
  toasts: PortfolioToasts & {
    invalid_url?: string;
  };
  ui: UIStrings;
}
