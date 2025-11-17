import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

import { AvailabilityBadge } from '../components/header/AvailabilityBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSectionTelemetry } from '../telemetry/useSectionTelemetry';
import { Badge } from '../design-system/primitives/Badge';
import { Button } from '../design-system/primitives/Button';
import { Card } from '../design-system/primitives/Card';
import { SectionWrapper } from '../design-system/primitives/SectionWrapper';
import { storage } from '../utils/storage';

import type {
  AvailabilityKey,
  HeroDescriptionSegment,
  HeroMetaItem,
  HeroTitleSegment,
  PortfolioToasts,
  Stat
} from '../types/portfolio';

const DOMAIN_HINTS: Record<string, string> = {
  'portalio-presentacion-2025.pages.dev': 'Hola desde Cloudflare Pages!',
  localhost: 'Modo local activo para pruebas',
  '127.0.0.1': 'Pruebas locales habilitadas'
};

type AvailabilityState = 'available' | 'listening' | 'unavailable';
const AVAILABILITY_STORAGE_KEY = 'portfolio_availability';
const isAvailability = (value: unknown): value is AvailabilityState =>
  value === 'available' || value === 'listening' || value === 'unavailable';
const getStoredAvailability = () => storage.get(AVAILABILITY_STORAGE_KEY, 'listening', isAvailability);

export default function Hero() {
  const { data } = useLanguage();
  const [ref] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const { showToast } = useToast();
  const [availability, setAvailability] = useState<AvailabilityState>(getStoredAvailability);
  useSectionTelemetry('home');

  const heroCopy = data.hero;

  const resolvedMeta = (heroCopy.meta ?? []).reduce<{ label: string; value: string }[]>(
    (acc, metaItem: HeroMetaItem) => {
      const value =
        'field' in metaItem && metaItem.field
          ? data[metaItem.field]
          : 'value' in metaItem
          ? metaItem.value
          : undefined;
      if (value) {
        acc.push({ label: metaItem.label, value });
      }
      return acc;
    },
    []
  );

  const defaultTitleSegments: readonly HeroTitleSegment[] = [{ text: data.title }];
  const defaultDescriptionSegments: readonly HeroDescriptionSegment[] = [{ text: data.description }];

  const titleSegments: readonly HeroTitleSegment[] = heroCopy.titleSegments?.length
    ? heroCopy.titleSegments
    : defaultTitleSegments;

  const descriptionSegments: readonly HeroDescriptionSegment[] = heroCopy.descriptionSegments?.length
    ? heroCopy.descriptionSegments
    : defaultDescriptionSegments;

  const tagline = heroCopy.tagline ?? data.tagline ?? '';
  const taglineSegments = tagline.split(/(IA generativa|iOS)/gi);
  const status = heroCopy.status;
  const note = heroCopy.note;
  const focusItems = Array.isArray(note?.items) ? note.items : [];

  const availabilityLabel = data.availability?.status?.[availability] ?? availability;
  const availabilityToggleLabel = data.availability?.toggle?.[availability] ?? 'Cambiar disponibilidad';
  const availabilityCycle: AvailabilityKey[] = ['available', 'listening', 'unavailable'];
  const toastKeyMap: Record<AvailabilityKey, keyof PortfolioToasts | null> = {
    available: 'availability_available',
    listening: 'availability_listening',
    unavailable: 'availability_unavailable'
  };
  const toastTypeMap: Record<AvailabilityKey, 'success' | 'info' | 'warning'> = {
    available: 'success',
    listening: 'info',
    unavailable: 'warning'
  };

  const [domainHint, setDomainHint] = useState<string | null>(null);
  const heroTitleLine = data.title ?? heroCopy.eyebrow ?? '';
  const roleSegments = heroTitleLine.split('&').map(segment => segment.trim()).filter(Boolean);
  const primaryRole = roleSegments[0] ?? heroTitleLine;
  const secondaryRole = roleSegments[1] ?? '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    const message = DOMAIN_HINTS[host] ?? `Bienvenido desde ${host}`;
    setDomainHint(message);
  }, []);

  const handleToggleAvailability = () => {
    const currentIndex = availabilityCycle.indexOf(availability);
    const next = availabilityCycle[(currentIndex + 1) % availabilityCycle.length];
    setAvailability(next);
    const toastKey = toastKeyMap[next];
    const toastMessage = toastKey ? data.toasts?.[toastKey] : null;
    if (toastMessage) {
      showToast(toastMessage, toastTypeMap[next]);
    }
  };

  useEffect(() => {
    storage.set(AVAILABILITY_STORAGE_KEY, availability);
  }, [availability]);

  return (
    <SectionWrapper
      id="home"
      className="page-section page-section--hero fx-chaos-bg"
      aria-labelledby="hero-heading"
      data-dev-id="2001"
    >
      <m.div ref={ref} className="hero-shell" initial={undefined} animate={undefined}>
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-content">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <AvailabilityBadge
                availability={availability}
                badgeClass={`availability-${availability}`}
                label={availabilityLabel}
                toggleLabel={availabilityToggleLabel}
                onToggle={handleToggleAvailability}
              />
            </div>
            <div className="hero-role-banner" aria-label="Rol principal">
              <span className="hero-role-banner__eyebrow">{heroCopy.eyebrow ?? 'Liderazgo iOS · IA generativa'}</span>
              <div className="hero-role-banner__headline">
                <span className="hero-role-banner__headline-part">{primaryRole}</span>
                {secondaryRole ? (
                  <>
                    <span className="hero-role-banner__divider" aria-hidden="true">
                      •
                    </span>
                    <span className="hero-role-banner__headline-part hero-role-banner__headline-part--accent">
                      {secondaryRole}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="hero-title-wrap" aria-hidden="false">
              <div className="hero-title-rays" aria-hidden="true" />
              <h1 id="hero-heading" className="hero-title">
                {titleSegments.map((segment: HeroTitleSegment, index: number) =>
                  segment.accent ? (
                    <span
                      key={`${segment.text}-${index}`}
                      className={`hero-title__accent hero-title__accent--${segment.accent}`}
                    >
                      {segment.text}
                    </span>
                  ) : (
                    <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
                  )
                )}
              </h1>
            </div>
            {(heroCopy.subtitle ?? data.subtitle) ? (
              <p className="hero-subheadline">{heroCopy.subtitle ?? data.subtitle}</p>
            ) : null}
            <p className="hero-tagline">
              {taglineSegments.map((segment: string, index: number) => {
                if (!segment) {
                  return null;
                }
                const normalized = segment.toLowerCase();
                if (normalized === 'ia generativa') {
                  return (
                    <span key={`tagline-ia-${index}`} className="hero-tagline__accent">
                      {segment}
                    </span>
                  );
                }
                if (normalized === 'ios') {
                  return (
                    <span key={`tagline-ios-${index}`} className="hero-tagline__accent hero-tagline__accent--ios">
                      {segment}
                    </span>
                  );
                }
                return <Fragment key={`tagline-text-${index}`}>{segment}</Fragment>;
              })}
            </p>
            <p className="hero-description">
              {descriptionSegments.map((segment: HeroDescriptionSegment, index: number) =>
                segment.accent === 'gradient' ? (
                  <span key={`${segment.text}-${index}`} className="hero-description__accent">
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
                )
              )}
            </p>
            {focusItems.length ? (
              <ul
                className="hero-focus-grid"
                role="list"
                aria-label={data.lang === 'en' ? 'Active focus areas' : 'Frentes activos'}
              >
                {focusItems.map(item => (
                  <li key={item} className="hero-focus-chip" role="listitem">
                    <span aria-hidden="true">▹</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="hero-cta-row">
              <Button asChild>
                <a href="#projects">{data.ui.viewProjects}</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="#contact">{data.ui.bookCall}</a>
              </Button>
            </div>
            <div className="hero-meta-bar" role="list">
              {resolvedMeta.length ? (
                <span className="hero-meta-chip" role="listitem">
                  <MapPin size={16} aria-hidden="true" />
                  {resolvedMeta[0].value}
                </span>
              ) : null}
              <span className="hero-meta-chip" role="listitem">
                {data.email}
              </span>
              {domainHint ? (
                <span className="hero-meta-chip" role="listitem">
                  {domainHint}
                </span>
              ) : null}
            </div>
          </div>

          <aside className="hero-panel" aria-label={data.lang === 'en' ? 'Current focus' : 'Foco actual'}>
            <Card as="div" className="hero-panel__card hero-panel__card--status" data-dev-id="2002">
              <span className="hero-panel__eyebrow">{status.title}</span>
              <p className="hero-panel__description">{status.description}</p>
            </Card>

            <Card as="div" className="hero-panel__card hero-panel__card--stats" data-dev-id="2003">
              <span className="hero-panel__eyebrow">{data.lang === 'en' ? 'Measured impact' : 'Impacto medible'}</span>
              <ul
                className="hero-panel__stats"
                role="list"
                aria-label={data.lang === 'en' ? 'Impact metrics' : 'Métricas de impacto'}
              >
                {data.stats.map((stat: Stat) => (
                  <li key={stat.id} role="listitem">
                    <span className="hero-panel__stat-value">{stat.value}</span>
                    <span className="hero-panel__stat-label">{stat.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </m.div>
    </SectionWrapper>
  );
}
