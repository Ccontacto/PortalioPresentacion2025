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

## QA / Herramientas

- Ejecutar `npm run spec:build && npm run test`.
- Próximos pasos: Storybook + visual snapshots para primitivas; integrar `npm run spec:watch` al flujo de desarrollo.
