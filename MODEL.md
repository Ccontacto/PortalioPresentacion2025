# Modelo de Estado · 2025-11-07

- Proyecto: `portfolio-jctr-2025` v2.2.1
- Objetivo: Portfolio SPA bilingüe con CV exportable
- Estado: build y tests OK según README (no re‑ejecutado ahora)
- Entradas clave: `src/main.tsx`, `src/App.tsx`, `index.html`
- Estilos: Tailwind v4 + tokens en `src/index.css` y utilidades personalizadas
- Animación: Framer Motion
- Accesibilidad: `FocusTrap` en menú móvil, `SkipToContent`, `PageProgress`, `prefers-reduced-motion`
- i18n: `src/data/{es,en}.ts`
- PDF: `src/utils/pdfGenerator.ts` (jsPDF)
- Contextos: `ThemeContext`, `LanguageContext`, `NavigationContext`, `ToastContext`
- Tests: Vitest + Testing Library (hooks, contexts, secciones clave)
- Scripts: `dev`, `build`, `preview`, `test:ci`, `check:ci`, `deploy:cf`
- Deploy: Cloudflare Pages (output `dist`)
- Config: `vite.config.ts`, `tailwind.config.js`, `eslint.config.cjs`, `tsconfig.json`

Fuente de verdad: `package.json`, `README.md`, árbol `src/`

