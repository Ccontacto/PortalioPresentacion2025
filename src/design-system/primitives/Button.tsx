import type { ButtonHTMLAttributes } from 'react';

import { portfolioComponents } from '../tokens';
import { cx } from '../../utils/cx';
import { resolveSpecValue } from '../utils/resolveSpecValue';
import './styles.css';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const primarySpec = portfolioComponents['button.primary'];
const ghostSpec = portfolioComponents['button.ghost'];

const getSpecForVariant = (variant: ButtonVariant) => (variant === 'ghost' ? ghostSpec : primarySpec);

export function Button({ variant = 'primary', className, style, ...rest }: ButtonProps) {
  const spec = getSpecForVariant(variant);
  const mergedStyle: React.CSSProperties = {
    background: resolveSpecValue(spec.bg),
    color: resolveSpecValue(spec.fg),
    borderRadius: resolveSpecValue(spec.radius),
    padding: `${resolveSpecValue(spec.paddingY)} ${resolveSpecValue(spec.paddingX)}`,
    fontSize: resolveSpecValue(spec.fontSize),
    fontWeight: resolveSpecValue(spec.fontWeight),
    boxShadow: resolveSpecValue(spec.shadow),
    borderColor: resolveSpecValue(spec.borderColor),
    borderWidth: resolveSpecValue(spec.borderWidth),
    ...style
  };
  return (
    <button className={cx('ds-button', variant === 'primary' ? 'ds-button--primary' : 'ds-button--ghost', className)} style={mergedStyle} {...rest} />
  );
}
