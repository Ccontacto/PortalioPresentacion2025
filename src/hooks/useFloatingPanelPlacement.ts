import { useEffect, useState } from 'react';

type Options = {
  /** Minimum preferred width in px; falls back to 88% of viewport */
  preferredWidth?: number;
  /** Gap in px between button and panel */
  gap?: number;
  /** Safe margin to viewport edges */
  safe?: number;
  /** Min maxHeight floor */
  minMaxHeight?: number;
};

export function useFloatingPanelPlacement(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  { preferredWidth = 640, gap = 8, safe = 12, minMaxHeight = 180 }: Options = {}
) {
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | undefined>(undefined);
  const [panelMaxHeight, setPanelMaxHeight] = useState<string | undefined>(undefined);
  const [openUpFlag, setOpenUpFlag] = useState<boolean>(false);
  const [rightAnchored, setRightAnchored] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;

    const compute = () => {
      const btn = anchorRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const screenFactor = Math.min(vw, vh);
      const dynamicWidth = Math.min(
        Math.max(Math.floor(0.8 * screenFactor), preferredWidth),
        Math.floor(0.95 * vw)
      );
      const prefWidth = dynamicWidth;

      // Vertical placement
      const spaceAbove = rect.top - safe;
      const spaceBelow = vh - rect.bottom - safe;
      const openUp = spaceAbove >= minMaxHeight || spaceAbove >= spaceBelow;
      const maxH = Math.max(minMaxHeight, Math.floor(openUp ? spaceAbove : spaceBelow));
      setPanelMaxHeight(`${maxH}px`);
      setOpenUpFlag(openUp);

      let style: React.CSSProperties = { width: prefWidth, maxHeight: `${maxH}px`, position: 'fixed' };

      // Horizontal alignment
      const rightSpace = vw - rect.right - safe;
      const leftSpace = rect.left - safe;
      if (leftSpace >= prefWidth) {
        style.right = Math.max(safe, Math.floor(vw - rect.right)) + 'px';
        setRightAnchored(true);
      } else if (rightSpace >= prefWidth) {
        style.left = Math.max(safe, Math.floor(rect.left)) + 'px';
        setRightAnchored(false);
      } else {
        const left = Math.min(Math.max(safe, rect.left), Math.max(safe, vw - prefWidth - safe));
        style.left = left + 'px';
        // Decide an anchor: if panel starts near left side, anchor left; else right
        setRightAnchored(left > vw / 2);
      }

      // Vertical offsets
      if (openUp) {
        const bottom = Math.max(safe, Math.floor(vh - rect.top + gap));
        style.bottom = bottom + 'px';
      } else {
        style.top = Math.max(safe, Math.floor(rect.bottom + gap)) + 'px';
      }

      setPanelStyle(style);
    };

    const frame = window.requestAnimationFrame(compute);
    const onResize = () => {
      if (open) compute();
    };
    const listenerOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener('resize', onResize, listenerOptions);
    window.addEventListener('orientationchange', onResize, listenerOptions);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize, listenerOptions);
      window.removeEventListener('orientationchange', onResize, listenerOptions);
    };
  }, [open, anchorRef, preferredWidth, gap, safe, minMaxHeight]);

  return { panelStyle, panelMaxHeight, openUp: openUpFlag, rightAnchored } as const;
}
