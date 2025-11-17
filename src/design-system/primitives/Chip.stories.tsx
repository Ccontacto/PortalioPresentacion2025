import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Design/Chip',
  component: Chip,
  args: {
    children: 'Telemetry'
  }
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {};
