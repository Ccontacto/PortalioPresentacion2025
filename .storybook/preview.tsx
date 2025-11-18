import type { Preview } from '@storybook/react';

import { StorybookProviders } from '../src/storybook/StorybookProviders';

import '../src/index.css';

const ensureSpecTokens = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('spec-tokens-link')) return;
  const link = document.createElement('link');
  link.id = 'spec-tokens-link';
  link.rel = 'stylesheet';
  link.href = '/spec-tokens.css';
  document.head.appendChild(link);
};

ensureSpecTokens();

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
    a11y: {
      context: '#storybook-root'
    }
  },
  decorators: [
    Story => (
      <StorybookProviders>
        <Story />
      </StorybookProviders>
    )
  ]
};

export default preview;
