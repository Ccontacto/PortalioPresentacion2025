import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../../utils/cx';
import './styles.css';

type SectionWrapperProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(({ children, className, ...rest }, ref) => (
  <section ref={ref} className={cx('ds-section', className)} {...rest}>
    <div className="ds-section__inner">{children}</div>
  </section>
));

SectionWrapper.displayName = 'SectionWrapper';
