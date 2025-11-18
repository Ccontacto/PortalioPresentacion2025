import { cloneElement, isValidElement } from 'react';

import { cx } from '../../utils/cx';

import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import './styles.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  asChild?: boolean;
  children?: ReactNode;
};

type SlotChild = ReactElement<Record<string, unknown> & { className?: string }>;

export function Button({ variant = 'primary', className, asChild = false, children, ...rest }: ButtonProps) {
  const classes = cx('ds-button', variant === 'primary' ? 'ds-button--primary' : 'ds-button--ghost', className);

  if (asChild && isValidElement(children)) {
    const child = children as SlotChild;
    return cloneElement(child, {
      ...(rest as Record<string, unknown>),
      className: cx(child.props.className, classes)
    });
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
