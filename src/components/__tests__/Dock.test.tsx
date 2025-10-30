import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dock from '../Dock';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import '@testing-library/jest-dom/vitest';

// Mock the language data
const mockData = {
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
  ],
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

describe('Dock Component', () => {
  it('should move focus to the right when ArrowRight is pressed', () => {
    renderWithProviders(<Dock />);
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(firstButton, { key: 'ArrowRight' });
    expect(secondButton).toHaveFocus();
  });

  it('should move focus to the left when ArrowLeft is pressed', () => {
    renderWithProviders(<Dock />);
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];

    secondButton.focus();
    expect(secondButton).toHaveFocus();

    fireEvent.keyDown(secondButton, { key: 'ArrowLeft' });
    expect(firstButton).toHaveFocus();
  });

  it('should wrap focus from the last item to the first when ArrowRight is pressed', async () => {
    renderWithProviders(<Dock />);
    const buttons = screen.getAllByRole('button');
    const lastButton = buttons[buttons.length - 1];

    lastButton.focus();
    expect(lastButton).toHaveFocus();

    fireEvent.keyDown(lastButton, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('aria-label', 'Home');
    });
  });

  it('should wrap focus from the first item to the last when ArrowLeft is pressed', async () => {
    renderWithProviders(<Dock />);
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(firstButton, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('aria-label', 'Skills');
    });
  });
});
