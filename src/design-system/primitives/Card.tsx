import { cx } from '../../utils/cx';

import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

import './styles.css';

type CardProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'className' | 'children'>;

export function Card<T extends ElementType = 'section'>({ as, children, className, ...rest }: CardProps<T>) {
  const Component = (as ?? 'section') as ElementType;
  return (
    <Component className={cx('ds-card', className)} {...rest}>
      {children}
    </Component>
  );
}
