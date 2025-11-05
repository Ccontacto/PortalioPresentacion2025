import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SearchBar from '../SearchBar';

import type { ProjectItem } from '../../types/portfolio';

const navigateToMock = vi.fn();
const mockProjects: ProjectItem[] = [
  { id: 'p1', title: 'Alpha', description: 'Alpha project', tags: ['React', 'TypeScript'] },
  { id: 'p2', title: 'Beta', description: 'Beta project', tags: ['Node'] }
];

vi.mock('../../contexts/NavigationContext', async () => {
  const actual = await vi.importActual('../../contexts/NavigationContext');
  return {
    ...actual,
    useNavigation: () => ({
      activePage: 'home',
      setActivePage: vi.fn(),
      navigateTo: navigateToMock
    })
  };
});

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    data: {
      ui: {
        viewProjects: 'Ver proyectos'
      }
    }
  })
}));

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('SearchBar', () => {
  beforeEach(() => {
    navigateToMock.mockReset();
  });

  it('navigates to projects when "Ver proyectos" is pressed', async () => {
    const onSearch = vi.fn();
    render(<SearchBar projectItems={mockProjects} onSearch={onSearch} />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /abrir buscador de proyectos/i }));
    const input = await screen.findByRole('searchbox');

    await user.type(input, 'react');
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('react');
    });

    await user.click(screen.getByRole('button', { name: /ver proyectos/i }));
    await waitFor(() => {
      expect(navigateToMock).toHaveBeenCalledWith('projects');
    });
  });
});
