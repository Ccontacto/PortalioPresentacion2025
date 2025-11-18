import { cx } from '../../utils/cx';

import type { HTMLAttributes } from 'react';

import './styles.css';

type BadgeVariant = 'highlight';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = 'highlight', className, ...rest }: BadgeProps) {
  return <span className={cx('ds-badge', `ds-badge--${variant}`, className)} {...rest} />;
}
