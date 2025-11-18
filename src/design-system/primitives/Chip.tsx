import type { HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';
import './styles.css';

export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('ds-chip', className)} {...rest} />;
}
