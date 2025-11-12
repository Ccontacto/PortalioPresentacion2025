import { m } from 'framer-motion';
import { Fragment, useState } from 'react';
import { MapPin } from 'lucide-react';

import { AvailabilityBadge } from '../components/header/AvailabilityBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
// motion reducido no condiciona visibilidad del héroe

import type {
  AvailabilityKey,
  HeroDescriptionSegment,
  HeroMetaItem,
  HeroTitleSegment,
  PortfolioToasts,
  Stat
} from '../types/portfolio';

export default function Hero() {
  const { data } = useLanguage();
  const [ref] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const { showToast } = useToast();
  const [availability, setAvailability] = useState<'available' | 'listening' | 'unavailable'>(() => {
    if (typeof window !== 'undefined') {
      const v = window.localStorage.getItem('portfolio_availability');
      if (v === 'available' || v === 'listening' || v === 'unavailable') return v;
    }
    // Estado inicial: escuchando propuestas
    return 'listening';
  });

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

  const titleSegments: HeroTitleSegment[] = heroCopy.titleSegments?.length
    ? heroCopy.titleSegments
    : [{ text: data.title }];

  const descriptionSegments: HeroDescriptionSegment[] = heroCopy.descriptionSegments?.length
    ? heroCopy.descriptionSegments
    : [{ text: data.description }];

  const tagline = heroCopy.tagline ?? data.tagline ?? '';
  const taglineSegments = tagline.split(/(IA generativa|iOS)/gi);
  const status = heroCopy.status;
  const note = heroCopy.note;

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

  const handleToggleAvailability = () => {
    const currentIndex = availabilityCycle.indexOf(availability);
    const next = availabilityCycle[(currentIndex + 1) % availabilityCycle.length];
    setAvailability(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio_availability', next);
    }
    const toastKey = toastKeyMap[next];
    const toastMessage = toastKey ? data.toasts?.[toastKey] : null;
    if (toastMessage) {
      showToast(toastMessage, toastTypeMap[next]);
    }
  };


  return (
    <section id="home" className="page-section page-section--hero fx-chaos-bg" aria-labelledby="hero-heading" data-dev-id="2001">
      <m.div
        ref={ref}
        className="hero-shell"
        /* Evitar gating de visibilidad en iOS: héroe siempre visible al inicio */
        initial={undefined}
        animate={undefined}
      >
        <div className="hero-backdrop" aria-hidden="true"></div>
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
            <span className="hero-eyebrow">{heroCopy.eyebrow}</span>
            <div className="hero-title-wrap" aria-hidden="false">
              <div className="hero-title-rays" aria-hidden="true" />
              <h1 id="hero-heading" className="hero-title">
              {titleSegments.map((segment, index) =>
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
            <p className="hero-tagline">
              {taglineSegments.map((segment, index) => {
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
              {descriptionSegments.map((segment, index) =>
                segment.accent === 'gradient' ? (
                  <span key={`${segment.text}-${index}`} className="hero-description__accent">
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
                )
              )}
            </p>

            <div className="hero-actions">
              <a className="hero-action hero-action--primary" href="#projects">
                {data.ui.viewProjects}
              </a>
              <a className="hero-action hero-action--ghost" href="#contact">
                {data.ui.bookCall}
              </a>
            </div>
            <div className="hero-locale" data-dev-id="2001-locale">
              {resolvedMeta.length ? (
                <div className="hero-location-chip">
                  <MapPin size={18} aria-hidden="true" />
                  <span>{resolvedMeta[0].value}</span>
                </div>
              ) : null}
              <div className="hero-stat-chips" role="list" aria-label={data.lang === 'en' ? 'Impact metrics' : 'Métricas de impacto'}>
                {data.stats.map((stat: Stat) => (
                  <div key={stat.id} className="hero-stat-chip" role="listitem">
                    <span className="hero-stat-chip__value">{stat.value}</span>
                    <span className="hero-stat-chip__label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="hero-panel" aria-label={data.lang === 'en' ? 'Current focus' : 'Foco actual'}>
            <div className="hero-panel__card hero-panel__card--status" data-dev-id="2002">
              <span className="hero-panel__eyebrow">{status.title}</span>
              <p className="hero-panel__description">{status.description}</p>
            </div>

            <div className="hero-panel__card hero-panel__card--note fx-sketch-outline" data-dev-id="2004">
              <span className="hero-panel__eyebrow">{note.title}</span>
              <div className="hero-panel__tags" role="list">
                {note.items.map(item => (
                  <span key={item} className="hero-panel__tag" role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </m.div>
    </section>
  );
}
