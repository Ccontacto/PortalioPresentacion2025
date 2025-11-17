# Telemetry Layer

## Metrics
- View duration & count stored in `localStorage` (`portfolio_section_metrics`).
- Events dispatched via `CustomEvent('telemetry:section-metrics')` for reactive consumers.
- Hooks: `useSectionTelemetry(sectionId, { threshold })`, `useTelemetryNavOrder(navItems)`.
- API: `incrementSectionView`, `addSectionDuration`, `getSectionMetrics`, `subscribeToTelemetry`, `reorderItemsByTelemetry`.

## Errors
- `logAppError(error, info)` builds a payload and POSTs to `VITE_TELEMETRY_ENDPOINT` (fallback `/api/errors`).
- Uses `navigator.sendBeacon` when available; otherwise `fetch` with `keepalive`.
- Only logs to console in DEV.

## Usage
```ts
import { useSectionTelemetry } from '../telemetry/useSectionTelemetry';

function ProjectsSection() {
  useSectionTelemetry('projects');
  // ...
}

import { useTelemetryNavOrder } from '../telemetry/useTelemetryNavOrder';
const navItems = useTelemetryNavOrder(rawNavItems);
```
