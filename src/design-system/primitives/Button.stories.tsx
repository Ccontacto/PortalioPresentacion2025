import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';


const meta: Meta<typeof Button> = {
  title: 'Design/Button',
  component: Button,
  args: {
    children: 'Acción principal'
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost action'
  }
};

export const AsChildLink: Story = {
  render: args => (
    <Button {...args} asChild>
      <a href="https://portalio-presentacion-2025.pages.dev" target="_blank" rel="noreferrer">
        Ir al sitio
      </a>
    </Button>
  )
};
