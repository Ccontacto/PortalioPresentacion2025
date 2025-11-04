import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useKonamiCode } from '../useKonamiCode';

function KonamiTest({ onTrigger }: { onTrigger: () => void }) {
  useKonamiCode(onTrigger);
  return null;
}

describe('useKonamiCode', () => {
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ];

  it('invokes the callback after the full sequence', () => {
    const callback = vi.fn();
    render(<KonamiTest onTrigger={callback} />);

    sequence.forEach(key => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets progress when the sequence is interrupted', () => {
    const callback = vi.fn();
    render(<KonamiTest onTrigger={callback} />);

    [...sequence.slice(0, 3), 'Escape', ...sequence].forEach(key => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
