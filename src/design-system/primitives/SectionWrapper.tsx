import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';
import './styles.css';

type SectionWrapperProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function SectionWrapper({ children, className, ...rest }: SectionWrapperProps) {
  return (
    <section className={cx('ds-section', className)} {...rest}>
      <div className="ds-section__inner">{children}</div>
    </section>
  );
}
