import type { Meta, StoryObj } from '@storybook/react';

import Experience from './Experience';


const meta: Meta<typeof Experience> = {
  title: 'Sections/Experience',
  component: Experience,
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof Experience>;

export const Default: Story = {
  render: () => <Experience />
};
