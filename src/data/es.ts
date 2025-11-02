export const es = {
  lang: 'es',
  name: 'José Carlos Torres Rivera',
  title: 'Generative AI & iOS',
  subtitle: 'IA Generativa e iOS',
  tagline: 'Reimagino experiencias con IA desde el prototipo hasta el lanzamiento',
  description:
    'Mobile tech lead con 12+ años en iOS y arquitectura. Especialización independiente en IA generativa: integración de LLMs, generación de imágenes y arquitecturas RAG.',
  email: 'jctorresrivera@gmail.com',
  phone: '+52 56 1172 7994',
  whatsapp: '5611727994',
  location: 'Ciudad de México, México',
  social: {
    linkedin: 'https://www.linkedin.com/in/josecarivera',
    github: 'https://github.com/Ccontacto',
    portfolio: 'https://www.yosoymx.com'
  },
  availability: {
    status: {
      available: 'Disponible',
      listening: 'Escuchando propuestas',
      unavailable: 'No disponible'
    },
    toggle: {
      available: 'Cambiar a escuchando',
      listening: 'Cambiar a no disponible',
      unavailable: 'Cambiar a disponible'
    }
  },
  badge: 'Disponible',
  nav: [
    { id: 'home', label: 'Inicio' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' }
  ],
  stats: [
    { id: 's1', value: '12+', label: 'Años' },
    { id: 's2', value: '50+', label: 'Proyectos' },
    { id: 's3', value: '85%', label: 'Cobertura Tests' }
  ],
  sections: {
    experience: {
      title: 'Experiencia',
      jobs: [
        {
          id: 'e1',
          role: 'Independent AI/iOS Consultant & Technical Advisor',
          company: 'Freelance / Proyectos Personales',
          period: 'Ago 2024 — Presente',
          description:
            'Especialización en IA Generativa vía R&D y proyectos personales: LLMs, generación de imágenes y RAG.',
          tags: ['GPT-4', 'Gemini', 'LLaMA', 'Stable Diffusion', 'LangChain', 'RAG', 'SwiftUI', 'Python']
        },
        {
          id: 'e2',
          role: 'Project Lead & Senior iOS Developer',
          company: 'Coppel',
          period: 'Mayo 2022 — Ago 2024',
          description:
            'Optimización de arquitectura, mejora de buscador (+~10% precisión) y squad ágil para features.',
          tags: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'Core Data', 'GraphQL', 'Firebase', 'AWS']
        },
        {
          id: 'e3',
          role: 'Technical Lead iOS & Framework Architect',
          company: 'Procesar',
          period: 'Mar 2018 — May 2022',
          description:
            'Framework biométrico modular y gobernanza de APIs con seguridad y monitoreo.',
          tags: ['Swift', 'Objective-C', 'Core ML', 'XCTest', 'CI/CD', 'Fastlane', 'Security']
        }
      ]
    },
    skills: {
      title: 'Habilidades',
      categories: [
        {
          id: 'ios',
          icon: 'device',
          title: 'iOS',
          items: ['Swift', 'SwiftUI', 'UIKit', 'Core ML']
        },
        {
          id: 'ai',
          icon: 'robot',
          title: 'IA Generativa',
          items: ['GPT-4', 'Gemini', 'Stable Diffusion', 'LangChain', 'RAG']
        },
        {
          id: 'cloud',
          icon: 'cloud',
          title: 'Cloud & DevOps',
          items: ['AWS', 'Firebase', 'Docker', 'GitHub Actions']
        }
      ]
    },
    projects: {
      title: 'Proyectos',
      items: [
        {
          id: 'p1',
          title: 'Self-Evolving Legal System',
          description: 'Agente legal autónomo con RAG multi-paso.',
          tags: ['RAG', 'GPT-4', 'LangChain', 'Python'],
          link: 'https://github.com/Ccontacto'
        },
        {
          id: 'p2',
          title: 'Condominium App',
          description: 'App SwiftUI con asistente virtual para condominios.',
          tags: ['SwiftUI', 'Gemini', 'Firebase', 'RAG'],
          link: 'https://www.yosoymx.com'
        }
      ]
    },
    contact: {
      title: 'Contacto',
      subtitle: '¿Tienes un proyecto? Hablemos.',
      closing: 'Abierto a proyectos de IA e iOS.',
      signature: '— José Carlos'
    }
  },
  tooltips: {
    copy: 'Copiar email',
    email: 'Email',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    pdf: 'Descargar CV',
    celebrate: 'Celebrar',
    language: 'EN',
    theme: 'Tema'
  },
  toasts: {
    welcome: '¡Bienvenido a mi portfolio! 👋',
    email_copy_success: 'Email copiado ✓',
    email_copy_error: 'No se pudo copiar el email. Intenta manualmente.',
    whatsapp_open: 'Abriendo WhatsApp...',
    availability_available: 'Estado actualizado: disponible',
    availability_listening: 'Estado actualizado: escuchando propuestas',
    availability_unavailable: 'Estado actualizado: no disponible'
  }
};
