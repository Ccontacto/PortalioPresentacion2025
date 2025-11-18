import { cx } from '../../utils/cx';

import type { HTMLAttributes } from 'react';

import './styles.css';

export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('ds-chip', className)} {...rest} />;
}
