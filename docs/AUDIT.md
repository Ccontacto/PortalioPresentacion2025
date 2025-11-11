## Auditoría de Accesibilidad y Lighthouse

### A11y (jest-axe + Vitest)
- Ejecuta auditoría de componentes clave:
- Comando: `npm run audit:a11y`
- Cobertura: Quick Actions Menu y SearchBar (modales/navegación). La regla `color-contrast` está deshabilitada en JSDOM; el contraste ya se validó por tema a nivel de tokens.

### Lighthouse (Accesibilidad/SEO/Performance)
1. Build o preview:
   - `npm run build` (opcional) y `npm run preview` en una terminal (puerto 5176)
2. En otra terminal, corre:
   - `npm run audit:lh`
3. Reporte HTML en `logs/lh-report.html`.

### Criterios de aprobación sugeridos
- Accesibilidad ≥ 95, Performance ≥ 90, SEO ≥ 95.
- Sin errores ARIA en modales/overlays; foco siempre visible; navegación por teclado completa.
