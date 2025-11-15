import { storage } from './storage';
import { isRecord } from './typeGuards';

type SectionMetrics = {
  views: number;
  totalMs: number;
  lastViewed: number | null;
};

type MetricsRecord = Record<string, SectionMetrics>;

const STORAGE_KEY = 'portfolio_section_metrics';

const isSectionMetrics = (value: unknown): value is SectionMetrics => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.views === 'number' &&
    typeof value.totalMs === 'number' &&
    (typeof value.lastViewed === 'number' || value.lastViewed === null)
  );
};

const isMetricsRecord = (value: unknown): value is MetricsRecord => {
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).every(isSectionMetrics);
};

const getMetrics = (): MetricsRecord =>
  storage.get<MetricsRecord>(STORAGE_KEY, {}, isMetricsRecord) ?? {};

const saveMetrics = (next: MetricsRecord) => {
  storage.set(STORAGE_KEY, next);
};

const ensureEntry = (metrics: MetricsRecord, sectionId: string): SectionMetrics => {
  if (!metrics[sectionId]) {
    metrics[sectionId] = {
      views: 0,
      totalMs: 0,
      lastViewed: null
    };
  }
  return metrics[sectionId];
};

export const incrementSectionView = (sectionId: string) => {
  const metrics = getMetrics();
  const entry = ensureEntry(metrics, sectionId);
  entry.views += 1;
  entry.lastViewed = Date.now();
  saveMetrics(metrics);
};

export const addSectionDuration = (sectionId: string, deltaMs: number) => {
  if (Number.isNaN(deltaMs) || deltaMs <= 0) {
    return;
  }
  const metrics = getMetrics();
  const entry = ensureEntry(metrics, sectionId);
  entry.totalMs += deltaMs;
  entry.lastViewed = Date.now();
  saveMetrics(metrics);
};

export const getSectionMetrics = (): MetricsRecord => getMetrics();

export const reorderItemsByTelemetry = <T extends { id: string }>(items: readonly T[]): T[] => {
  const metrics = getMetrics();
  const hasData = Object.values(metrics).some(entry => entry.views > 0 || entry.totalMs > 0);
  if (!hasData) {
    return [...items];
  }
  return [...items].sort((a, b) => {
    const aMetrics = metrics[a.id];
    const bMetrics = metrics[b.id];
    const aViews = aMetrics?.views ?? 0;
    const bViews = bMetrics?.views ?? 0;
    if (aViews !== bViews) {
      return bViews - aViews;
    }
    const aTime = aMetrics?.totalMs ?? 0;
    const bTime = bMetrics?.totalMs ?? 0;
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    const aRecency = aMetrics?.lastViewed ?? 0;
    const bRecency = bMetrics?.lastViewed ?? 0;
    return bRecency - aRecency;
  });
};
