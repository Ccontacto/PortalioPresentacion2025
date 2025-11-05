export const es = {
  lang: 'es',
  name: 'José Carlos Torres Rivera',
  title: 'Líder Técnico iOS & Arquitecto de IA',
  subtitle: 'Líder Técnico iOS & Arquitecto de IA',
  tagline: 'Integro IA generativa en productos iOS desde la visión hasta el lanzamiento',
  description:
    'Arquitecto de software y líder técnico iOS con 12+ años creando apps nativas, arquitecturas escalables y squads de alto desempeño. Especialista en Swift/SwiftUI, Clean Architecture y adopción de IA generativa (RAG, Core ML, LangChain).',
  email: 'jctorresrivera@live.com',
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
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' }
  ],
  stats: [
    { id: 's1', value: '12+', label: 'Años liderando iOS' },
    { id: 's2', value: '+10 %', label: 'Precisión en búsquedas' },
    { id: 's3', value: '85 %', label: 'Cobertura de pruebas' }
  ],
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
    availability_available: 'Estado actualizado: disponible',
    availability_listening: 'Estado actualizado: escuchando propuestas',
    availability_unavailable: 'Estado actualizado: no disponible',
    retro_enabled: 'Modo retro activado. Bienvenido al futuro en 8 bits.',
    retro_disabled: 'Modo retro desactivado. Volviendo al presente.'
  },
  ui: {
    viewProjects: 'Ver proyectos',
    retroExit: 'Salir de modo retro',
    retroActiveLabel: 'Modo retro activo'
  }
};
