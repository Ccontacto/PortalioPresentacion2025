import type { AvailabilityState } from './types';
import type { JSX } from 'react';

type Props = {
  availability: AvailabilityState;
  badgeClass: string;
  icon?: JSX.Element;
  label: string;
  toggleLabel: string;
  onToggle: () => void;
};

export function AvailabilityBadge({
  availability,
  badgeClass,
  icon,
  label,
  toggleLabel,
  onToggle
}: Props) {
  return (
    <button
      type="button"
      className={`availability-badge ${badgeClass}`}
      onClick={onToggle}
      aria-label={toggleLabel}
      data-availability={availability}
      data-retro-sfx
    >
      <span className="availability-indicator" aria-hidden="true"></span>
      {icon ? (
        <span className="availability-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="availability-label" aria-live="polite">
        {label}
      </span>
    </button>
  );
}
