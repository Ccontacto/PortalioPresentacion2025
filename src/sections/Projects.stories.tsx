import type { Meta, StoryObj } from '@storybook/react';

import Projects from './Projects';


const meta: Meta<typeof Projects> = {
  title: 'Sections/Projects',
  component: Projects,
  parameters: { layout: 'fullscreen' }
};

export default meta;

type Story = StoryObj<typeof Projects>;

export const Default: Story = {
  render: () => <Projects />
};
