import type { PortfolioData } from '../types/portfolio';

export const es: PortfolioData = {
  lang: 'es',
  name: 'José Carlos Torres Rivera',
  title: 'Líder Técnico iOS & Arquitecto de IA',
  subtitle: 'IA generativa segura en ecosistemas iOS',
  tagline: 'Arquitectura iOS con IA medible de punta a punta',
  description:
    'Arquitecto de software y líder técnico iOS con 12+ años creando apps nativas, arquitecturas escalables y squads de alto desempeño. Especialista en Swift, SwiftUI, Clean Architecture y adopción de IA generativa (RAG, Core ML, LangChain).',
  email: 'jctorresrivera@gmail.com',
  phone: '+52 56 1172 7994',
  whatsapp: '5611727994',
  location: 'Centro, CDMX, México',
  social: {
    linkedin: 'https://linkedin.com/in/jctorresrivera',
    github: 'https://github.com/josecarlos21',
    portfolio: 'https://www.orquestador.ai'
  },
  availability: {
    status: {
      available: 'Disponible',
      listening: 'Escuchando propuestas',
      unavailable: 'No disponible'
    },
    toggle: {
      available: 'Cambiar a escuchando propuestas',
      listening: 'Cambiar a no disponible',
      unavailable: 'Cambiar a disponible'
    }
  },
  badge: 'Escuchando propuestas',
  nav: [
    { id: 'home', label: 'Inicio' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'focus', label: 'Enfoque' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' }
  ],
  stats: [
    { id: 's1', value: '12+', label: 'Años liderando iOS' },
    { id: 's2', value: '10%', label: 'Mejora en precisión de búsqueda' },
    { id: 's3', value: '85%', label: 'Cobertura de pruebas' }
  ],
  hero: {
    eyebrow: 'Estrategia iOS · IA confiable',
    titleSegments: [
      { text: 'Líder Técnico iOS', accent: 'primary' },
      { text: ' & ' },
      { text: 'Arquitecto de IA', accent: 'secondary' }
    ],
    descriptionSegments: [
      {
        text:
          'Conecto visión de producto y ejecución móvil para lanzar features respaldados por '
      },
      { text: 'Swift · SwiftUI', accent: 'gradient' },
      { text: ' y ' },
      { text: 'IA medible (RAG + Core ML)', accent: 'gradient' },
      { text: '. Mentor squads senior para llevar IA segura directo al dispositivo.' }
    ],
    status: {
      title: 'Ahora',
      description: 'Mentoreo squads para aterrizar IA en apps nativas y medir impacto sin riesgos.'
    },
    // Evitar duplicidad (la disponibilidad ya vive como badge y el enfoque en su sección)
    meta: [{ label: 'Ubicación', field: 'location' }],
    note: {
      title: 'En lo que estoy trabajando',
      items: ['IA en dispositivo', 'Playbooks RAG', 'CI/CD móvil', 'Lanzamientos medibles']
    },
    tagline: 'Arquitecturas nativas con IA segura y medible.'
  },
  sections: {
    experience: {
      title: 'Experiencia Profesional',
      jobs: [
        {
          id: 'e1',
          role: 'Project Lead & Senior iOS Developer',
          company: 'Coppel',
          period: 'Mayo 2022 – Agosto 2024',
          description:
            'Lideré un equipo iOS/backend/web/QA para modernizar la app principal, incorporé IA en el buscador (+≈10 % precisión y mejor conversión) y reduje los ciclos de despliegue de semanas a días con CI/CD y experimentación controlada.',
          tags: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'Core Data', 'GraphQL', 'Firebase', 'AWS', 'CI/CD', 'IA']
        },
        {
          id: 'e2',
          role: 'Technical Lead iOS',
          company: 'Procesar',
          period: 'Marzo 2018 – Mayo 2022',
          description:
            'Diseñé un framework biométrico modular voz/rostro adoptado por apps financieras, elevé la cobertura de pruebas de 62 % a 85 % con XCTest y gestioné la dirección temporal del área iOS asegurando entregables y mentoría.',
          tags: ['Swift', 'Objective-C', 'Core ML', 'XCTest', 'Fastlane', 'CI/CD', 'Seguridad']
        },
        {
          id: 'e3',
          role: 'Senior iOS Developer / Technical Lead',
          company: 'Claro Música / Ironbit',
          period: '2014 – 2018',
          description:
            'Desarrollé apps iOS multimedia con suscripciones y compras integradas, reescribí código legado aplicando Clean Architecture y MVVM, e implementé pipelines CI/CD con Jenkins y Fastlane para lanzamientos confiables.',
          tags: ['Swift', 'Objective-C', 'SwiftUI', 'Clean Architecture', 'MVVM', 'Jenkins', 'Fastlane', 'Notificaciones push']
        }
      ]
    },
    skills: {
      title: 'Habilidades Técnicas',
      categories: [
        {
          id: 'ios',
          icon: 'device',
          title: 'iOS nativo',
          items: ['Swift', 'SwiftUI', 'Objective-C', 'Combine', 'Core Data', 'MapKit', 'AVFoundation']
        },
        {
          id: 'architecture',
          icon: 'cpu',
          title: 'Arquitectura & Liderazgo',
          items: ['Clean Architecture', 'MVVM', 'Modularización', 'Microservicios', 'Mentoría', 'Comunicación técnica']
        },
        {
          id: 'ai',
          icon: 'robot',
          title: 'IA Generativa & MLOps',
          items: ['RAG', 'LangChain', 'Core ML', 'GPT-4', 'Gemini', 'LLaMA', 'Mistral', 'Prompt Engineering']
        },
        {
          id: 'cloud',
          icon: 'cloud',
          title: 'Cloud & DevOps',
          items: ['AWS (S3/Lambda)', 'Firebase', 'MongoDB', 'Docker', 'GitHub Actions', 'Fastlane', 'Xcode Cloud']
        }
      ]
    },
    projects: {
      title: 'Proyectos de IA Generativa',
      items: [
        {
          id: 'p1',
          title: 'Sistema Legal Auto-Evolutivo',
          description: 'Agentes autónomos con RAG para análisis jurídico y actualización dinámica del corpus legal.',
          tags: ['Swift', 'LangChain', 'GPT-4', 'Gemini']
        },
        {
          id: 'p2',
          title: 'Asistente de Condominios',
          description: 'Aplicación SwiftUI con asistente RAG para gestión administrativa y atención virtual continua.',
          tags: ['SwiftUI', 'Core Data', 'Gemini Pro']
        },
        {
          id: 'p3',
          title: 'Asistente Técnico iOS (RAG)',
          description: 'Chatbot nativo con LangChain + Gemini para soporte técnico contextual y respuestas inteligentes.',
          tags: ['SwiftUI', 'LangChain', 'Gemini Pro']
        },
        {
          id: 'p4',
          title: 'Agente de Prompts Generativos',
          description: 'Agente inteligente para creación automatizada de prompts multidominio y contenido guiado.',
          tags: ['Python', 'GPT-4', 'Gemini']
        }
      ]
    },
    focus: {
      eyebrow: 'Playbooks accionables',
      title: 'Estrategia lista para integrar en tu roadmap',
      subtitle:
        'Tres líneas de ejecución para acelerar lanzamientos iOS potenciados con IA, métricas claras y equipos alineados.',
      items: [
        {
          id: 'focus-ai',
          eyebrow: 'IA aplicada',
          title: 'IA confiable dentro del producto',
          description:
            'Diseño experiencias que mezclan RAG, modelos en dispositivo y guardrails medibles para liberar features seguros.',
          highlights: ['Evaluaciones automáticas', 'Guardrails multicanal', 'Controles de calidad continuos']
        },
        {
          id: 'focus-execution',
          eyebrow: 'Entrega continua',
          title: 'Operación que escala con tu equipo',
          description:
            'Creo pipelines móviles/IA con CI/CD, observabilidad y feature flags para lanzar sin fricción ni regresiones.',
          highlights: ['CI/CD móvil con métricas', 'Feature flags + experimentos', 'Tableros de salud del release']
        },
        {
          id: 'focus-leadership',
          eyebrow: 'Liderazgo',
          title: 'Alineación y coaching técnico',
          description:
            'Facilito decisiones entre producto, ingeniería y data con workshops, documentación y mentoría práctica.',
          highlights: ['Workshops tácticos', 'Documentación viva', 'Mentoría para squads']
        }
      ]
    },
    contact: {
      title: 'Contacto',
      subtitle: '¿Listo para acelerar tu roadmap de iOS e IA?',
      closing: 'Abierto a liderazgo técnico, consultoría y lanzamientos impulsados por IA.',
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
    invalid_url: 'Enlace no disponible.',
    availability_available: 'Estado actualizado: disponible',
    availability_listening: 'Estado actualizado: escuchando propuestas',
    availability_unavailable: 'Estado actualizado: no disponible',
    retro_enabled: 'Modo retro activado. Bienvenido al futuro en 8 bits.',
    retro_disabled: 'Modo retro desactivado. Volviendo al presente.'
  },
  ui: {
    viewProjects: 'Ver proyectos',
    bookCall: 'Agendar conversación',
    retroExit: 'Salir de modo retro',
    retroActiveLabel: 'Modo retro activo',
    quickActionsTitle: 'Acciones rápidas',
    searchAriaLabel: 'Buscar accesos rápidos',
    searchPlaceholder: 'Buscar…',
    noMatchesTitle: 'Sin coincidencias',
    noMatchesSubtitle: 'Ajusta la búsqueda o explora otras acciones.',
    quickSectionsLabel: 'Secciones',
    quickPreferencesLabel: 'Preferencias',
    searchFilterTitle: 'Filtrar proyectos',
    searchFilterSubtitle: 'Escribe una tecnología o selecciona una de las sugerencias.',
    searchPlaceholderTech: 'Buscar por tecnología...',
    searchClearLabel: 'Limpiar búsqueda',
    searchSuggestionsAria: 'Sugerencias destacadas',
    searchNoMatches: 'Sin coincidencias. Ajusta la búsqueda o lanza confetti.',
    prevProjects: 'Ver proyectos anteriores',
    nextProjects: 'Ver siguientes proyectos',
    prevSkills: 'Ver habilidades anteriores',
    nextSkills: 'Ver siguientes habilidades'
  }
} as const;
