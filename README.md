# PortalioPresentacion2025

Portfolio bilingüe (ES/EN) para José Carlos Torres Rivera construido con React 19, Vite 7, TypeScript 5.5 y Tailwind 4. El layout se arma en `src/App.tsx` y secciona la narrativa en Hero, Experience, Skills, Projects y Contact.

## Capas clave hoy
- **Design System tokenizado**: `src/index.css` define variables para texto, superficies, marca, estados y acentos, expuestas vía `@theme` para Tailwind 4.
- **Temas accesibles**: `ThemeContext` permite rotar entre light/dark/high-contrast y sincroniza las preferencias con `localStorage`.
- **Internacionalización**: `LanguageContext` y los datasets `src/data/es.ts`/`src/data/en.ts` habilitan un switch persistente con soporte futuro RTL.
- **Micro-interacciones**: Componentes como `ConfettiCanvas` y `PageProgress` consumen tokens desde `src/utils/designTokens.ts` para mantener consistencia cromática.

## Hoja de ruta “Stack 2025”
Consulta [`STACK_2025_ROADMAP.md`](./STACK_2025_ROADMAP.md) para el inventario actualizado, la validación del stack y las fases recomendadas hasta octubre 2025.
