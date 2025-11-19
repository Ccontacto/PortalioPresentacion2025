# 🎯 José Carlos Torres Rivera - Portfolio 2025

> **Portafolio profesional interactivo** — Ingeniero en Software, Arquitecto IA y Tech Lead especializado en aplicaciones modernas, escalables e impulsadas por IA generativa.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3+-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](/LICENSE)

---

## 🌟 Características

### 🎨 Diseño Moderno & Accesibilidad
- **Diseño Minimalista**: Interfaz limpia, intuitiva, sin hamburguesas. Todo navegable por clicks/taps.
- **Modo Oscuro Persistente**: Tema adaptado a preferencias del usuario con CSS variables.
- **Accesibilidad A11y**: Soporte ARIA, `prefers-reduced-motion`, navegación por teclado.
- **Diseño Responsivo**: Mobile-first, adaptado a todos los dispositivos.

### 🌍 Multiidioma & Automatización
- **Bilingüe**: Soporte completo para ES/EN con cambio en tiempo real.
- **i18n Nativo**: Sistema de traducción modular y escalable.
- **Generación de CV**: Descarga PDF automática del CV con estilos optimizados.

### ✨ Experiencia de Usuario
- **Animaciones Fluidas**: Framer Motion con respeto a `prefers-reduced-motion`.
- **Efecto Confeti**: Detalles de flair para interactividad.
- **Atajos de Teclado**: Navegación rápida y productiva.

### 🤖 Próximamente: Inteligencia Generativa
- **Agentes Copilot**: Asistencia IA para navegación, recomendaciones de proyectos y análisis.
- **Análisis Semántico**: Orquestación multiagente para auditorías y mejoras continuas.
- **Modelos Personalizados**: Integración con OpenAI, Claude y otros LLMs.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|----------|
| **Frontend** | React + TypeScript | 18.3 / 5.5 |
| **Build & Dev** | Vite | 5.3 |
| **Estilos** | Tailwind CSS 3.4 + CSS Variables | 3.4 |
| **Animaciones** | Framer Motion | 11.2 |
| **Iconos** | Lucide React | Latest |
| **PDF** | jsPDF | 2.5 |
| **Linting** | ESLint + Prettier | Latest |
| **Control de Versiones** | Git | - |

---

## 📦 Inicio Rápido

### Prerequisitos
- Node.js 18+ con npm/yarn/pnpm
- Git

### Instalación & Ejecución

```bash
# Clonar repositorio
git clone https://github.com/Ccontacto/PortalioPresentacion2025.git
cd PortalioPresentacion2025

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
npm run format
```

---

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── ThemeSwitcher/  # Control tema claro/oscuro
│   ├── LanguageSwitcher/ # Cambio de idioma
│   └── ErrorBoundary.tsx # Manejo de errores
├── sections/           # Secciones principales
│   ├── Hero.tsx        # Presentación
│   ├── Experience.tsx   # Experiencia profesional
│   ├── Skills.tsx      # Stack y habilidades
│   ├── Projects.tsx    # Portfolio de proyectos
│   └── Contact.tsx     # Contacto y redes
├── contexts/           # React Context para estado global
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── data/               # i18n y datos estáticos
│   ├── es.ts          # Traducciones español
│   └── en.ts          # Traducciones inglés
├── hooks/              # Custom hooks
├── utils/              # Funciones utilitarias
├── App.tsx             # Componente raíz
└── main.tsx            # Entry point
```

---

## 🎯 Secciones del Portafolio

### ⭐ Hero
Presentación visual impactante con animaciones y llamada a acción principal.

### 💼 Experience
Historial profesional con roles, responsabilidades y logros destacados.

### 🛠️ Skills
Stack técnico categorizado: lenguajes, frameworks, cloud, DevOps, IA/ML.

### 🚀 Projects
Vitrina de proyectos destacados con descripciones, tech stack y enlaces.

### 📧 Contact
Formulario de contacto, redes sociales (GitHub, LinkedIn, Twitter, etc.).

---

## 🤖 Agentes Copilot (Beta)

Este repositorio incluye un agente personalizado para Copilot que permite:

- **Análisis Inteligente**: Entiende la arquitectura del portafolio.
- **Recomendaciones Contextuales**: Sugiere mejoras y nuevas features.
- **Asistencia en Desarrollo**: Guía para colaboradores.
- **Automatización**: Propone cambios, actualiza documentación.

Ver [`AGENTS.md`](./AGENTS.md) para más detalles.

---

## 📊 Insights & Análisis

- **Lenguajes**: TypeScript 92.7%, CSS 4.3%, JavaScript 1.5%, HTML 1.2%, Python 0.3%
- **Performance**: Optimizado para Lighthouse (90+)
- **Bundle Size**: ~120KB gzipped
- **Accesibilidad**: WCAG 2.1 AA cumplido

Ver [`PROJECT_ANALYSIS.md`](./PROJECT_ANALYSIS.md) para análisis técnico detallado.

---

## 🔄 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/amazing-feature`
3. Commit tus cambios: `git commit -m 'Add amazing feature'`
4. Push a la rama: `git push origin feature/amazing-feature`
5. Abre un Pull Request

Ver [`DEVELOPMENT.md`](./DEVELOPMENT.md) para guía completa de desarrollo.

---

## 🎓 Aprendizaje & Recursos

- [React 18 Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [GitHub Copilot Agents](https://gh.io/customagents)

---

## 📝 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).

---

## 👨‍💻 Autor

**José Carlos Torres Rivera** (@Ccontacto)

- GitHub: [@Ccontacto](https://github.com/Ccontacto)
- LinkedIn: [Tu LinkedIn](#)
- Twitter/X: [@tuhandle](#)
- Email: [tu@email.com](#)

---

## 🙋 Soporte & Contacto

¿Preguntas, sugerencias o bugs? Abre un [issue](https://github.com/Ccontacto/PortalioPresentacion2025/issues).

**Made with ❤️ & AI-assisted development in 2025**
