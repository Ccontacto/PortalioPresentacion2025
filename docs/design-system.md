# Design System Pipeline

## Spec → Build → Runtime

1. **Source of truth**: `specs/portfolio-spec.json` describe meta, tokens, componentes, contenido y formularios.
2. **Build**: `npm run spec:build`
   - Genera módulos TS (`src/content/portfolioSpec.ts`, `src/design-system/tokens.ts`).
   - Emite `public/spec-tokens.css` con variables `--dt-` (color, layout, componentes).
3. **Runtime**
   - `PortfolioSpecProvider` expone el spec en React.
   - Primitivas (`src/design-system/primitives/`) consumen `portfolioComponents` + CSS vars.
   - Secciones importan `usePortfolioContent`/`usePortfolioForm` para rellenar títulos, copy y formularios.

## Primitivas disponibles

- `SectionWrapper`: aplica padding/gap del spec.
- `SectionHeader`, `Badge`, `Card`, `Chip`, `FormRenderer`.

## Iconografía y microinteracciones

- Todo el set de íconos vive ahora en `src/components/icons/VectorIcon.tsx`.  
  - Es un wrapper ligero sobre SVG inline, respeta los tokens `color` y `strokeWidth` del tema activo.  
  - Usa `navIconFor()` para mapear secciones → ícono (Navbar, Dock, HamburgerMenu).  
  - No se deben reinstalar librerías externas de íconos; cualquier recurso nuevo se agrega al mapa.
- Si encuentras código legado, conviértelo siguiendo este patrón:
  ```tsx
  // Antes (mal)
  import { MapPin } from 'lucide-react';
  <MapPin size={16} aria-hidden />;

  // Después (bien)
  import Icon from '@components/icons/VectorIcon';
  <Icon name="mapPin" size={16} aria-hidden />;
  ```
- Microinteracciones (hover/active/pressed) se componen con las mismas variables `--motion-*` declaradas en `src/index.css`.

## Entrypoint y despliegue Cloudflare

- `src/main.tsx` rota entre:
  - `LandingPlaceholder` (pre-home “En progreso”) para `/`.
  - App completa bajo `VITE_PORTFOLIO_MOUNT` (p. ej. `/portafolio/JoseCarlos`).
- `vite.config.ts` usa `PORTFOLIO_BASE_PATH`/`VITE_PORTFOLIO_MOUNT` para generar assets con base relativa correcta en Cloudflare Pages.
- Script helper: `npm run build:cloudflare` (envía `/portafolio/JoseCarlos` como base).

## QA / Herramientas

- Ejecutar `npm run spec:build && npm run test`.
- Próximos pasos: Storybook + visual snapshots para primitivas; integrar `npm run spec:watch` al flujo de desarrollo.
