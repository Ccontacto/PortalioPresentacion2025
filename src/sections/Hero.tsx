
import { AvailabilityBadge } from '@components/header/AvailabilityBadge';
import { useLanguage } from '@contexts/LanguageContext';
import { useToast } from '@contexts/ToastContext';
import { Button } from '@design-system/primitives/Button';
import { Card } from '@design-system/primitives/Card';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { storage } from '@utils/storage';
import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { AvailabilityKey, HeroMetaItem, PortfolioToasts, Stat } from '@portfolio-types';

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

  const status = heroCopy.status;
  const note = heroCopy.note;
  const focusItems = Array.isArray(note?.items) ? note.items : [];
  const noteFocusList = focusItems;
  const statusTitle = status?.title ?? (data.lang === 'en' ? 'Now' : 'Ahora');
  const statusDescription = status?.description ?? heroCopy.tagline ?? data.tagline ?? '';

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
            <div className="hero-availability-row">
              <AvailabilityBadge
                availability={availability}
                badgeClass={`availability-${availability}`}
                label={availabilityLabel}
                toggleLabel={availabilityToggleLabel}
                onToggle={handleToggleAvailability}
              />
            </div>
            <div className="hero-role-stack" aria-labelledby="hero-heading">
              <span className="hero-role-stack__eyebrow">
                {heroCopy.eyebrow ?? 'Liderazgo iOS · IA generativa'}
              </span>
              <h1 id="hero-heading" className="hero-role-stack__title">
                <span className="hero-role-stack__title-part">{primaryRole}</span>
                {secondaryRole ? (
                  <>
                    <span className="hero-role-stack__divider" aria-hidden="true">
                      •
                    </span>
                    <span className="hero-role-stack__title-part hero-role-stack__title-part--accent">
                      {secondaryRole}
                    </span>
                  </>
                ) : null}
              </h1>
            </div>
            {Array.isArray(heroCopy.descriptionSegments) && heroCopy.descriptionSegments.length ? (
              <p className="hero-description">
                {heroCopy.descriptionSegments.map((segment, index) => (
                  <span
                    key={`${segment.text}-${index}`}
                    className={segment.accent === 'gradient' ? 'highlight' : undefined}
                  >
                    {segment.text}
                  </span>
                ))}
              </p>
            ) : null}
            <div className="hero-cta-row">
              <Button asChild>
                <a href="#projects">{data.ui.viewProjects}</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="#contact">{data.ui.bookCall}</a>
              </Button>
            </div>
            <ul className="hero-meta-bar">
              {resolvedMeta.length ? (
                <li className="hero-meta-chip">
                  <MapPin size={16} aria-hidden="true" />
                  {resolvedMeta[0].value}
                </li>
              ) : null}
              {domainHint ? <li className="hero-meta-chip">{domainHint}</li> : null}
            </ul>
          </div>

          <aside className="hero-panel" aria-label={data.lang === 'en' ? 'Current focus' : 'Foco actual'}>
            <Card as="div" className="hero-panel__card hero-panel__card--status" data-dev-id="2002">
              <span className="hero-panel__eyebrow">{statusTitle}</span>
              <p className="hero-panel__description">{statusDescription}</p>
            </Card>

            {noteFocusList.length ? (
              <Card as="div" className="hero-panel__card hero-panel__card--note" data-dev-id="2004">
                <span className="hero-panel__eyebrow">{note?.title ?? 'Frentes activos'}</span>
                <ul className="hero-panel__note-chips">
                  {noteFocusList.map(item => (
                    <li key={item} className="hero-note-chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            <Card as="div" className="hero-panel__card hero-panel__card--stats" data-dev-id="2003">
              <span className="hero-panel__eyebrow">{data.lang === 'en' ? 'Measured impact' : 'Impacto medible'}</span>
              <ul className="hero-panel__stats" aria-label={data.lang === 'en' ? 'Impact metrics' : 'Métricas de impacto'}>
                {data.stats.map((stat: Stat) => (
                  <li key={stat.id}>
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
