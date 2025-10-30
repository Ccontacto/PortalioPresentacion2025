export type AvailabilityKey = 'available' | 'listening' | 'unavailable';

export interface NavItem {
  id: string;
  label: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
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

export interface PortfolioContactSection {
  title: string;
  subtitle: string;
  closing: string;
  signature: string;
}

export interface PortfolioSections {
  experience: {
    title: string;
    jobs: ExperienceJob[];
  };
  skills: {
    title: string;
    categories: SkillCategory[];
  };
  projects: {
    title: string;
    items: ProjectItem[];
  };
  contact: PortfolioContactSection;
}

export interface PortfolioTooltips {
  copy: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  pdf: string;
  celebrate: string;
  language: string;
  theme: string;
}

export interface PortfolioToasts {
  welcome?: string;
  email_copy_success: string;
  email_copy_error: string;
  whatsapp_open: string;
  availability_available: string;
  availability_listening: string;
  availability_unavailable: string;
}

export interface PortfolioData {
  lang: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  social: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
  availability: {
    status: Record<AvailabilityKey, string>;
    toggle: Record<AvailabilityKey, string>;
  };
  badge: string;
  nav: NavItem[];
  stats: Stat[];
  sections: PortfolioSections;
  tooltips: PortfolioTooltips;
  toasts: PortfolioToasts;
}
