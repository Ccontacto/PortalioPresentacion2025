import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Design/Badge',
  component: Badge,
  args: {
    children: 'Highlight'
  }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Highlight: Story = {
  args: {
    variant: 'highlight'
  }
};
