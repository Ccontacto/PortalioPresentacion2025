import type { CSSProperties } from 'react';

import { portfolioComponents } from '../tokens';
import { cx } from '../../utils/cx';
import { resolveSpecValue } from '../utils/resolveSpecValue';
import './styles.css';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

const sectionSpec = portfolioComponents['section.header'];

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  const titleStyle: CSSProperties = {
    fontSize: resolveSpecValue(sectionSpec.titleSize),
    fontWeight: resolveSpecValue(sectionSpec.titleWeight)
  };
  const subtitleStyle: CSSProperties = {
    fontSize: resolveSpecValue(sectionSpec.subtitleSize),
    color: resolveSpecValue(sectionSpec.subtitleColor)
  };
  return (
    <div className={cx('ds-section-header', className)} style={{ gap: resolveSpecValue(sectionSpec.gap) }}>
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
