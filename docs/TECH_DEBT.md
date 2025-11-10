# Registro de deuda técnica

Este archivo concentra piezas heredadas o experimentos retirados del runtime principal para mantener el código utilizable. Cada entrada incluye el origen y cómo reactivarla si vuelve a ser prioritaria.

## 1. Overlay “control remoto” para acciones rápidas
- **Origen:** `src/components/header/MobileActionsModal.tsx` y estilos `remote-*` en `src/index.css` (commit previo al refactor de abril 2025).
- **Motivo de retiro:** La cuadrícula de botones no era accesible (sin focus visible, dependía de gestos específicos) y bloqueaba la ejecución real de acciones en móviles.
- **Situación actual:** El modal usa una lista filtrable (`remote-search`) con botones estándares. El easter egg de Konami sigue disponible vía el input.
- **Cómo reactivarlo:** Recuperar los estilos eliminados (ver historial git de `src/index.css`) y reintroducir el markup del “remote”. Documentar la interacción con lectores de pantalla antes de volver a producción.

## 2. Artefactos históricos de planeación
- **Ubicación:** `logs/*.md`, `MODEL.md`, `STATE.latest.json`.
- **Uso previsto:** Narrar decisiones y snapshots durante sprints anteriores.
- **Motivo de deuda:** No participan en el build ni en la docu pública, pero contienen contexto útil. Mantenerlos separados evita contaminar README/PROJECT_ANALYSIS.
- **Acción futura:** Consolidar estos archivos en un timeline único o migrarlos a issues del repositorio si siguen siendo necesarios.

## 3. Tokens CSS generados en `public/tokens.css`
- **Contexto:** El archivo se genera con `npm run tokens:build`, pero actualmente está versionado para simplificar deploys.
- **Riesgo:** Puede desincronizarse si alguien olvida ejecutar el script tras tocar `tokens/core.json`.
- **Pendiente:** Automatizar la generación en CI o ignorar el artefacto y distribuirlo como parte del pipeline de build.
