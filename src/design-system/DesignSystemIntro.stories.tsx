import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './primitives/Badge';
import { Button } from './primitives/Button';
import { Card } from './primitives/Card';

const Description = () => (
  <Card>
    <h2 style={{ marginBottom: '0.5rem' }}>Sistema de diseño</h2>
    <p>
      Este Storybook comparte los mismos providers (Idioma, Tema, Portafolio Spec, Toasts) que la aplicación. Las
      variables exportadas desde <code>public/spec-tokens.css</code> se inyectan globalmente.
    </p>
    <ul>
      <li>Tokens definidos en <code>tokens/core.json</code> (OKLCH).</li>
      <li>Tipografía y motion en <code>src/index.css</code>.</li>
      <li>Primitives en <code>src/design-system/primitives</code>.</li>
    </ul>
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <Badge>Demo</Badge>
      <Button>CTA primaria</Button>
    </div>
  </Card>
);

const meta: Meta<typeof Description> = {
  title: 'Design/Overview',
  component: Description,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj<typeof Description>;

export const Intro: Story = {
  render: () => <Description />
};
