import { es } from './es';

export const en = {
  ...es,
  lang: 'en',
  subtitle: 'Generative AI & iOS',
  tagline: 'Transform ideas into AI-powered products',
  description:
    'Mobile tech lead with 12+ years in iOS and software architecture. Generative AI specialization via independent R&D: LLMs, image generation and RAG architectures.',
  badge: 'Available for projects',
  availability: {
    status: {
      available: 'Available',
      listening: 'Open to proposals',
      unavailable: 'Not available'
    },
    toggle: {
      available: 'Switch to open',
      listening: 'Switch to not available',
      unavailable: 'Switch to available'
    }
  },
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ],
  sections: {
    experience: { title: 'Experience', jobs: es.sections.experience.jobs },
    skills: { title: 'Skills', categories: es.sections.skills.categories },
    projects: { title: 'Projects', items: es.sections.projects.items },
    contact: {
      ...es.sections.contact,
      title: 'Contact',
      subtitle: "Project in mind? Let's talk."
    }
  },
  tooltips: { ...es.tooltips, language: 'ES' },
  toasts: {
    welcome: 'Welcome to my portfolio! 👋',
    email_copy_success: 'Email copied ✓',
    email_copy_error: 'Couldn’t copy the email. Please try manually.',
    whatsapp_open: 'Opening WhatsApp...',
    availability_available: 'Status updated: available',
    availability_listening: 'Status updated: open to proposals',
    availability_unavailable: 'Status updated: not available'
  }
};
