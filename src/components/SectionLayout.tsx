import { SectionHeader as DsSectionHeader } from '@design-system/primitives/SectionHeader';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';

import type { ComponentProps, ReactNode } from 'react';

type SectionWrapperProps = ComponentProps<typeof SectionWrapper>;

type SectionLayoutProps = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerClassName?: string;
} & Omit<SectionWrapperProps, 'id' | 'children'>;

export function SectionLayout({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  headerClassName,
  ...wrapperProps
}: SectionLayoutProps) {
  const headingId = `${id}-heading`;
  const headerClass = ['ds-stack', headerClassName].filter(Boolean).join(' ');

  return (
    <SectionWrapper id={id} aria-labelledby={headingId} {...wrapperProps}>
      <div className={headerClass}>
        <DsSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} id={headingId} />
      </div>
      {children}
    </SectionWrapper>
  );
}
