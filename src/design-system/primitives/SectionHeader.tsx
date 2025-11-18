
import { cx } from '../../utils/cx';
import { portfolioComponents } from '../tokens';
import { resolveSpecValue } from '../utils/resolveSpecValue';

import type { CSSProperties } from 'react';
import './styles.css';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
};

const sectionSpec = portfolioComponents['section.header'];

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

  return (
    <div className={cx('ds-section-header', className)} style={containerStyle}>
      {eyebrow ? <span className="ds-section-header__eyebrow">{eyebrow}</span> : null}
      <h2 className="ds-section-header__title" style={titleStyle}>
        {title}
      </h2>
      {subtitle ? (
        <p className="ds-section-header__subtitle" style={subtitleStyle}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
