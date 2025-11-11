import type { JSX } from 'react';

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
