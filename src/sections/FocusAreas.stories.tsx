import type { Meta, StoryObj } from '@storybook/react';

import FocusAreas from './FocusAreas';

const meta: Meta<typeof FocusAreas> = {
  title: 'Sections/FocusAreas',
  component: FocusAreas,
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof FocusAreas>;

export const Default: Story = {
  render: () => <FocusAreas />
};
