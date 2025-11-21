
import { cx } from '../../utils/cx';
import { portfolioComponents } from '../tokens';
import { resolveSpecValue } from '../utils/resolveSpecValue';

import type { CSSProperties, ReactNode } from 'react';
import './styles.css';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
};

const sectionSpec = portfolioComponents['section.header'];

const createTitleMarkup = (value: string): ReactNode => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parts = trimmed.split(/\s+/);
  const accent = parts.length > 1 ? parts.pop() ?? '' : parts[0];
  const base = parts && parts.length ? parts.join(' ') : '';

  return (
    <>
      {base ? (
        <>
          <span className="ds-section-header__title-primary">{base}</span>
          {' '}
        </>
      ) : null}
      {accent ? <span className="ds-section-header__title-accent">{accent}</span> : null}
    </>
  );
};

const createSubtitleMarkup = (value?: string): ReactNode => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const words = trimmed.split(/\s+/);
  const lead = words.splice(0, 3).join(' ');
  const remainder = words.join(' ');
  return (
    <>
      <span className="ds-section-header__subtitle-lede">{lead}</span>
      {remainder ? ` ${remainder}` : null}
    </>
  );
};

export function SectionHeader({ title, subtitle, eyebrow, className }: SectionHeaderProps) {
  const resolvedTitleSize = resolveSpecValue(sectionSpec.titleSize);
  const resolvedTitleWeight = resolveSpecValue(sectionSpec.titleWeight);
  const resolvedSubtitleSize = resolveSpecValue(sectionSpec.subtitleSize);
  const resolvedSubtitleColor = resolveSpecValue(sectionSpec.subtitleColor);
  const resolvedGap = resolveSpecValue(sectionSpec.gap);

  const titleStyle: CSSProperties = {
    fontSize: typeof resolvedTitleSize === 'string' || typeof resolvedTitleSize === 'number' ? resolvedTitleSize : undefined,
    fontWeight:
      typeof resolvedTitleWeight === 'string' || typeof resolvedTitleWeight === 'number' ? resolvedTitleWeight : undefined
  };

  const subtitleStyle: CSSProperties = {
    fontSize:
      typeof resolvedSubtitleSize === 'string' || typeof resolvedSubtitleSize === 'number' ? resolvedSubtitleSize : undefined,
    color: typeof resolvedSubtitleColor === 'string' ? resolvedSubtitleColor : undefined
  };

  const containerStyle: CSSProperties = {
    gap: typeof resolvedGap === 'string' || typeof resolvedGap === 'number' ? resolvedGap : undefined
  };

  const decoratedTitle = createTitleMarkup(title);
  const decoratedSubtitle = createSubtitleMarkup(subtitle);

  return (
    <div className={cx('ds-section-header', className)} style={containerStyle}>
      {eyebrow ? <span className="ds-section-header__eyebrow">{eyebrow}</span> : null}
      <h2 className="ds-section-header__title" style={titleStyle}>
        <span className="ds-section-header__title-display" aria-hidden="true">
          {decoratedTitle ?? title}
        </span>
        <span className="ds-section-header__title-plaintext">{title}</span>
      </h2>
      {subtitle ? (
        <p className="ds-section-header__subtitle" style={subtitleStyle}>
          <span className="ds-section-header__subtitle-display" aria-hidden="true">
            {decoratedSubtitle ?? subtitle}
          </span>
          <span className="ds-section-header__subtitle-plaintext">{subtitle}</span>
        </p>
      ) : null}
    </div>
  );
}
