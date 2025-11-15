import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import Dock from '../Dock';

const mockUseLanguage = vi.fn();
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage()
}));

const mockNavigate = vi.fn();
vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: () => ({
    activePage: 'skills',
    setActivePage: vi.fn(),
    navigateTo: mockNavigate
  })
}));

vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false)
}));

describe('Dock', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseLanguage.mockReturnValue({
      data: {
        nav: [
          { id: 'home', label: 'Home' },
          { id: 'skills', label: 'Skills' },
          { id: 'focus', label: 'Focus' }
        ]
      }
    });
  });

  it('renders navigation buttons and highlights the active page', () => {
    render(<Dock />);
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Skills')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Focus')).toBeInTheDocument();
  });

  it('navigates when a button is clicked', () => {
    render(<Dock />);
    const [focusButton] = screen.getAllByLabelText('Focus');
    fireEvent.click(focusButton);
    expect(mockNavigate).toHaveBeenCalledWith('focus');
  });
});
