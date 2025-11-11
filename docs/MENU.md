## Menú Flotante (Dock) — Diseño, Accesibilidad y Temas

> **Estado:** Documento histórico. El Dock flotante se retiró en 2025 y fue reemplazado por `QuickActionsMenu`. Conservamos estas notas como referencia (ver `docs/TECH_DEBT.md`, sección “Dock flotante 2024”).

Este documento resume cómo está construido el menú flotante (Dock), sus decisiones de diseño, accesibilidad, microinteracciones y cómo extenderlo. La implementación vive en `src/components/Dock.tsx` y sus estilos en `src/index.css` bajo la sección "DOCK".

### Objetivos de diseño
- Navegación primaria siempre a mano, sin invadir contenido.
- Microinteracciones consistentes (hover/press/active) con respeto a `prefers-reduced-motion`.
- Accesible con screen readers y teclado (ArrowLeft/Right, Home/End, Escape).
- Soporte de temas: claro, oscuro y konami (estética retro) vía `data-theme` del `<html>`.

### Arquitectura y estados
- `Dock` obtiene los items desde `LanguageContext` (`data.nav`) y el estado de página actual desde `NavigationContext`.
- Dos estados visuales:
  - Colapsado: muestra el botón de la sección activa y un toggle.
  - Expandido: muestra el botón activo + una cápsula con el resto de secciones.
- Oculta/rehace su visibilidad al hacer scroll para no tapar contenido (con timeout sutil).

### Accesibilidad
- Semántica: contenedor expandido usa `role="navigation"` con `aria-label` descriptivo.
- Toggle con `aria-expanded` y `aria-controls="floating-dock-nav"`.
- Teclado:
  - `ArrowLeft`/`ArrowRight` mueven el foco entre opciones.
  - `Home`/`End` saltan a primera/última opción.
  - `Escape` cierra y devuelve foco al toggle.
- Foco: al expandir, se enfoca la primera opción disponible; al cerrar, vuelve al toggle.

### Temas (claro / oscuro / konami)
- El tema activo se expone en `html[data-theme='light'|'dark'|'konami']` desde `ThemeContext`.
- Los estilos del Dock usan variables de diseño y prefijos por tema ya definidos en `src/index.css`:
  - `--surface-*`, `--text-*`, `--border-*`, `--gradient-*`.
  - Guardan consistencia visual sin acoplar estilos a colores crudos.

### Microinteracciones
- Hover/active: elevación y desplazamiento controlado (`--motion-fast`, `--ease-standard`).
- Estado expandido aplica clase `is-active` al toggle.
- Respeta `prefers-reduced-motion` mediante `useReducedMotion` y variantes de Framer Motion.

### Extensión
- Agregar una nueva sección: sumar `{ id, label }` a `data.nav` (ES/EN) y, opcionalmente, un ícono en `icons` dentro de `Dock.tsx`.
- Temas: añadir overrides bajo `html[data-theme='nuevo']` en `src/index.css` y exponer el tema desde `ThemeContext` si aplica.
- A11y: mantener `aria-*` y targets de toque ≥44px (`.dock-item`/`.icon-btn`).

### Pruebas
- `src/components/__tests__/Dock.test.tsx` cubre navegación con flechas, wrap-around, Home/End, foco al expandir y retorno de foco al cerrar.

### Buenas prácticas aplicadas
- Componentes desacoplados por contexto (idioma, navegación, tema).
- Tokens de diseño y custom properties para consistencia multi-tema.
- Efectos idempotentes y limpieza adecuada de listeners/timeouts.
