import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';
import { SectionWrapper } from './SectionWrapper';

const meta: Meta<typeof Card> = {
  title: 'Design/Card',
  component: Card,
  args: {
    children: 'Card content'
  }
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: args => (
    <SectionWrapper>
      <Card {...args} />
    </SectionWrapper>
  )
};
