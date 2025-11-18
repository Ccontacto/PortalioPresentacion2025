import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { SectionWrapper } from './SectionWrapper';

const meta: Meta<typeof SectionWrapper> = {
  title: 'Design/SectionWrapper',
  component: SectionWrapper,
  args: {
    children: (
      <Card>
        <p>Contenido de sección renderizado dentro de un Card.</p>
      </Card>
    )
  }
};

export default meta;

type Story = StoryObj<typeof SectionWrapper>;

export const Default: Story = {};

export const WithHeader: Story = {
  render: args => (
    <SectionWrapper {...args}>
      <SectionHeader eyebrow="Portfolio" title="Sección destacada" description="Wrapper con layout responsivo" />
      <Card>
        <p>Usa SectionWrapper para alinear las secciones principales del sitio.</p>
      </Card>
    </SectionWrapper>
  )
};
