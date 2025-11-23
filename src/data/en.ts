import { es } from './es';

import type { PortfolioData } from '../types/portfolio';

export const en: PortfolioData = {
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
    // Reduce metadata to avoid duplicating Availability (badge) and Focus (section)
    meta: [{ label: 'Location', field: 'location' }],
    note: {
      title: 'Recent obsessions',
      items: ['On-device AI', 'RAG playbooks', 'Mobile CI/CD']
    },
    tagline: 'Ship native AI experiences from prototype to scale'
  },
  stats: [
    { id: 's1', value: '12+', label: 'Years leading iOS' },
    { id: 's2', value: '10%', label: 'Search precision uplift' },
    { id: 's3', value: '85%', label: 'Test coverage' }
  ],
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
    { id: 'focus', label: 'Focus' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ],
  sections: {
    experience: { title: '', jobs: es.sections.experience.jobs },
    skills: { title: '', categories: es.sections.skills.categories },
    projects: { title: '', items: es.sections.projects.items },
    focus: {
      eyebrow: 'Actionable playbooks',
      title: 'Deploy iOS + AI with clarity',
      subtitle: 'Three execution lanes to launch and scale initiatives with measurable impact.',
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
    invalid_url: 'Link unavailable.',
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
    searchNoMatches: 'No matches. Adjust your query or launch confetti.',
    prevProjects: 'View previous projects',
    nextProjects: 'View next projects',
    prevSkills: 'View previous skills',
    nextSkills: 'View next skills',
    prevFocus: 'View previous playbook',
    nextFocus: 'View next playbook',
    themeSwitcherLabel: 'Theme',
    themeSwitcherSubtitle: 'Visual modes'
  }
} as const;
