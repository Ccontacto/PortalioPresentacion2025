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
}
