import { es } from './es';

import type { PortfolioData } from '../types/portfolio';

export const en = {
  ...es,
  lang: 'en',
  title: 'iOS Tech Lead & AI Architect',
  subtitle: 'Generative AI roadmaps for native products',
  tagline: 'Ship native AI experiences from prototype to scale',
  description:
    'Mobile tech lead with 12+ years building iOS products, orchestrating squads and shaping resilient architectures. Specialist in Swift, SwiftUI, Clean Architecture and responsible generative AI (RAG, Core ML, LangChain).',
  badge: 'Available for projects',
  hero: {
    eyebrow: 'iOS · Generative AI leadership',
    titleSegments: [
      { text: 'iOS Tech Lead', accent: 'primary' },
      { text: ' & ' },
      { text: 'AI Architect', accent: 'secondary' }
    ],
    descriptionSegments: [
      {
        text:
          'Mobile tech lead with 12+ years building iOS products, orchestrating squads and shaping resilient architectures. Specialist in '
      },
      { text: 'Swift · SwiftUI', accent: 'gradient' },
      { text: ', Clean Architecture and ' },
      { text: 'responsible generative AI', accent: 'gradient' },
      { text: ' (RAG, Core ML, LangChain).' }
    ],
    status: {
      title: 'Now',
      description:
        'Partnering with squads to launch native experiences infused with responsible generative AI.'
    },
    meta: [
      { label: 'Location', field: 'location' },
      { label: 'Availability', field: 'badge' },
      { label: 'Focus', value: 'Generative AI acceleration for native apps' }
    ],
    note: {
      title: 'Recent obsessions',
      items: ['On-device AI', 'RAG playbooks', 'Mobile CI/CD']
    },
    tagline: 'Ship native AI experiences from prototype to scale'
  },
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
    focus: {
      eyebrow: 'Actionable playbooks',
      title: 'Strategy ready for your roadmap',
      subtitle:
        'Three execution lanes to launch iOS + AI initiatives with measurable impact, faster releases and aligned squads.',
      items: [
        {
          id: 'focus-ai',
          eyebrow: 'Applied AI',
          title: 'Reliable AI inside the product',
          description:
            'Blend RAG, on-device models and measurable guardrails so assistants and automations ship safely.',
          highlights: ['Automated evaluations', 'Multichannel guardrails', 'Continuous quality controls']
        },
        {
          id: 'focus-execution',
          eyebrow: 'Delivery',
          title: 'Operations that scale with the team',
          description:
            'Craft mobile/AI pipelines with CI/CD, observability and feature flags to iterate without regressions.',
          highlights: ['Mobile CI/CD metrics', 'Feature flags & experiments', 'Release health dashboards']
        },
        {
          id: 'focus-leadership',
          eyebrow: 'Leadership',
          title: 'Alignment & technical coaching',
          description:
            'Facilitate product, engineering and data decisions with workshops, documentation and hands-on mentoring.',
          highlights: ['Tactical workshops', 'Living documentation', 'Squad mentorship']
        }
      ]
    },
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
    availability_unavailable: 'Status updated: not available',
    retro_enabled: 'Retro mode enabled. Welcome to the 8-bit future.',
    retro_disabled: 'Retro mode disabled. Back to the present.'
  },
  ui: {
    viewProjects: 'View projects',
    bookCall: 'Book intro call',
    retroExit: 'Exit retro mode',
    retroActiveLabel: 'Retro mode active',
    quickActionsTitle: 'Quick actions',
    searchAriaLabel: 'Search quick actions',
    searchPlaceholder: 'Search…',
    noMatchesTitle: 'No matches',
    noMatchesSubtitle: 'Try adjusting your query or explore other actions.',
    quickSectionsLabel: 'Sections',
    quickPreferencesLabel: 'Preferences',
    searchFilterTitle: 'Filter projects',
    searchFilterSubtitle: 'Type a technology or pick one of the suggestions.',
    searchPlaceholderTech: 'Search by technology...',
    searchClearLabel: 'Clear search',
    searchSuggestionsAria: 'Featured suggestions',
    searchNoMatches: 'No matches. Adjust your query or launch confetti.'
  }
} as const satisfies PortfolioData;
