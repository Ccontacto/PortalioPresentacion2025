import type { Preview } from '@storybook/react';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      element: '#storybook-root',
      config: {},
      options: {},
      manual: false
    }
  }
};

export default preview;
