import type { Meta, StoryObj } from '@storybook/react';

import { FormRenderer } from './FormRenderer';


const meta: Meta<typeof FormRenderer> = {
  title: 'Design/FormRenderer',
  component: FormRenderer,
  args: {
    formId: 'contactForm'
  }
};

export default meta;

type Story = StoryObj<typeof FormRenderer>;

export const ContactForm: Story = {};
