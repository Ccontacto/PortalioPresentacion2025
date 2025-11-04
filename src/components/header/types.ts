import type { AvailabilityKey } from '../../types/portfolio';
import type { JSX } from 'react';

export type AvailabilityState = AvailabilityKey;

export type QuickAction = {
  key: string;
  label: string;
  icon?: JSX.Element;
  action: () => void;
  disabled?: boolean;
  immediate?: boolean;
};

export type QuickActionGroup = {
  id: string;
  label: string;
  items: QuickAction[];
};
