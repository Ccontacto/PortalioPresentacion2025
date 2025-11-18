import { cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import { cx } from '../../utils/cx';
import './styles.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  asChild?: boolean;
  children?: ReactNode;
};

export function Button({ variant = 'primary', className, asChild = false, children, ...rest }: ButtonProps) {
  const classes = cx('ds-button', variant === 'primary' ? 'ds-button--primary' : 'ds-button--ghost', className);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: cx(children.props.className, classes),
      ...rest
    });
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
