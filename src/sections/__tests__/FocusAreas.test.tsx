import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import FocusAreas from '../FocusAreas';

const mockUseLanguage = vi.fn();
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage()
}));

vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false)
}));

const mockRef = { current: null };
vi.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [mockRef, true]
}));

describe('FocusAreas', () => {
  beforeEach(() => {
    mockUseLanguage.mockReturnValue({
      data: {
        sections: {
          focus: {
            eyebrow: 'Playbooks',
            title: 'Focus Title',
            subtitle: 'Ready for your roadmap',
            items: [
              {
                id: 'focus-1',
                eyebrow: 'AI',
                title: 'Applied AI',
                description: 'Trustworthy embeddings',
                highlights: ['Vector DB tuning', 'Prompt guardrails']
              },
              {
                id: 'focus-2',
                eyebrow: 'Delivery',
                title: 'Reliable execution',
                description: 'CI/CD and observability',
                highlights: ['Automated releases', 'Feature flags']
              }
            ]
          }
        }
      }
    });
  });

  it('renders focus section header and cards', () => {
    render(<FocusAreas />);
    expect(screen.getByText('Playbooks')).toBeInTheDocument();
    expect(screen.getByText('Focus Title')).toBeInTheDocument();
    expect(screen.getByText('Ready for your roadmap')).toBeInTheDocument();
    expect(screen.getByText('Applied AI')).toBeInTheDocument();
    expect(screen.getByText('Reliable execution')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
});
