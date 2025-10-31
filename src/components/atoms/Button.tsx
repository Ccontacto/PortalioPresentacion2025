import { type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

// Mapeo de variantes a clases de Tailwind usando los nuevos tokens semánticos
const variants = {
  primary: 'bg-brand-primary text-text-inverse hover:bg-brand-hover active:bg-brand-active',
  secondary: 'bg-surface-alt text-text-primary hover:bg-border-subtle active:bg-border-default',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-alt active:bg-border-subtle',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'h-11 w-11 flex items-center justify-center', // Cumple con el target táctil de 44x44
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

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
