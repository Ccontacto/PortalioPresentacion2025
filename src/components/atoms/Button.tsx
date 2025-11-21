import { LazyMotion, domAnimation, m } from 'framer-motion';
import { type ElementType, type ReactNode } from 'react';

type ButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const variantClasses = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost'
};

const sizeClasses = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
  icon: 'btn--icon'
};

export function Button<T extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  type MotionLookup = Record<string, React.ComponentType<Record<string, unknown>>>;
  const motionProxy = m as unknown as MotionLookup;
  const MotionComponent =
    typeof Component === 'string' && motionProxy[Component] ? motionProxy[Component] : m.button;

  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <LazyMotion features={domAnimation}>
      <MotionComponent
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className={classes}
        {...props}
      >
        {children}
      </MotionComponent>
    </LazyMotion>
  );
}
