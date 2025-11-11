import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';

import { NavigationProvider } from '../../contexts/NavigationContext';
import SearchBar from '../SearchBar';

import type { ProjectItem } from '../../types/portfolio';

const mockProjects: ProjectItem[] = [
  { id: 'p1', title: 'Alpha', description: 'Alpha project', tags: ['React'] },
  { id: 'p2', title: 'Beta', description: 'Beta project', tags: ['Node'] }
];

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({ data: { lang: 'en', ui: { viewProjects: 'View projects' } } })
}));

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const Providers = ({ children }: { children: React.ReactNode }) => (
  <NavigationProvider>{children}</NavigationProvider>
);

describe('A11y: SearchBar', () => {
  it('has no obvious accessibility violations when modal is open', async () => {
    const { container } = render(
      <Providers>
        <SearchBar projectItems={mockProjects} onSearch={() => {}} />
      </Providers>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /open projects search|abrir buscador/i }));

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false }
      }
    });
    expect(results).toHaveNoViolations();
  });
});
