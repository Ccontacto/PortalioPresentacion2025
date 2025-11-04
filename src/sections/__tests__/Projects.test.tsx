import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Projects from '../Projects';

import '@testing-library/jest-dom/vitest';
import type { ProjectItem } from '../../types/portfolio';

// Mock the language data
const mockData = {
  sections: {
    projects: {
      title: 'Projects',
      items: [
        {
          id: '1',
          title: 'Valid Project',
          description: 'A project with a valid link.',
          tags: ['React'],
          link: 'https://example.com',
        } as ProjectItem,
        {
          id: '2',
          title: 'Invalid Project',
          description: 'A project with an invalid link.',
          tags: ['JS'],
          link: 'javascript:alert("xss")',
        } as ProjectItem,
        {
          id: '3',
          title: 'Project Without Link',
          description: 'A project without a link.',
          tags: ['TS'],
        } as ProjectItem,
      ],
    },
  },
  nav: [],
  // Add other necessary mock data if components need it
};

// Mock useLanguage hook
vi.mock('../../contexts/LanguageContext', async () => {
    const actual = await vi.importActual('../../contexts/LanguageContext');
    return {
        ...actual as object,
        useLanguage: () => ({
            data: mockData,
            currentLang: 'es',
            toggleLanguage: () => {},
        }),
    };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
        <NavigationProvider>
            {ui}
        </NavigationProvider>
    </ThemeProvider>
  );
};

describe('Projects Section', () => {
  it('should render a link for a project with a valid http/https url', () => {
    renderWithProviders(<Projects />);
    const validProjectArticle = screen.getByText('Valid Project').closest('article');
    expect(validProjectArticle).toBeInTheDocument();
    const link = within(validProjectArticle!).getByRole('link', { name: /Ver proyecto/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should not render a link for a project with an invalid (e.g., javascript:) url', () => {
    renderWithProviders(<Projects />);
    const invalidHeading = screen.getAllByText('Invalid Project')[0];
    const invalidProjectArticle = invalidHeading.closest('article');
    expect(invalidProjectArticle).toBeInTheDocument();
    const link = within(invalidProjectArticle!).queryByRole('link', { name: /Ver proyecto/i });
    expect(link).toBeNull();
  });

  it('should not render a link for a project that does not have a link property', () => {
    renderWithProviders(<Projects />);
    const noLinkHeading = screen.getAllByText('Project Without Link')[0];
    const noLinkProjectArticle = noLinkHeading.closest('article');
    expect(noLinkProjectArticle).toBeInTheDocument();
    const link = within(noLinkProjectArticle!).queryByRole('link', { name: /Ver proyecto/i });
    expect(link).toBeNull();
  });
});
