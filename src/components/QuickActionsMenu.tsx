import { Loader2, Menu } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigation } from '../contexts/NavigationContext';

import { QuickActionsModal } from './QuickActionsModal';
import { useQuickActionsData } from './quick-actions/useQuickActionsData';

import type { QuickAction, QuickActionGroup } from './quick-actions/types';

type FabPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export default function QuickActionsMenu() {
  const { navigateTo } = useNavigation();
  const { navItems, preferenceItems } = useQuickActionsData();

  const [open, setOpen] = useState(false);
  const [fabPosition, setFabPosition] = useState<FabPosition>('bottom-right');
  const [loading, setLoading] = useState(false);
  const openTimerRef = useRef<number | null>(null);

  const scheduleOpen = useCallback(() => {
    // Abre inmediatamente; spinner solo como feedback breve
    if (!open) setOpen(true);
    if (loading) return; // ya mostrando feedback
    setLoading(true);
    if (typeof window !== 'undefined') {
      openTimerRef.current = window.setTimeout(() => {
        setLoading(false);
        openTimerRef.current = null;
      }, 250);
    } else {
      setLoading(false);
    }
  }, [loading, open]);

  // Limpieza de timer si el componente se desmonta
  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
    };
  }, []);

  const navActions = useMemo<QuickAction[]>(() => {
    return navItems.map(item => ({
      key: `nav-${item.id}`,
      label: item.label,
      action: () => {
        navigateTo(item.id);
        setOpen(false);
      },
      immediate: true
    }));
  }, [navItems, navigateTo]);

  const groups = useMemo<QuickActionGroup[]>(() => {
    const result: QuickActionGroup[] = [];
    if (navActions.length) {
      result.push({ id: 'nav', label: 'Secciones', items: navActions });
    }
    result.push({ id: 'preferences', label: 'Preferencias', items: preferenceItems });
    return result;
  }, [navActions, preferenceItems]);

  // Ajusta posición del FAB para no tapar UI en dispositivos pequeños
  useEffect(() => {
    const compute = () => {
      if (typeof window === 'undefined') return;
      const { innerWidth: w, innerHeight: h } = window;
      // Heurística: en pantallas muy pequeñas, llevarlo a top-right
      const smallViewport = w < 380 || h < 700;
      setFabPosition(smallViewport ? 'top-right' : 'bottom-right');
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  return (
    <div className="quick-menu" data-position={fabPosition} data-dev-id="1200">
      <button
        type="button"
        className="quick-menu-button"
        data-retro-sfx
        data-testid="quick-actions-button"
        onClick={() => scheduleOpen()}
        onTouchEnd={event => {
          // En móviles: dispara apertura inmediata y evita click fantasma
          event.preventDefault();
          scheduleOpen();
        }}
        aria-haspopup="dialog"
        aria-controls={open ? 'quick-actions-modal' : undefined}
        aria-expanded={open}
        aria-busy={loading ? 'true' : 'false'}
        aria-label="Abrir menú de acciones"
      >
        {loading ? (
          <Loader2 size={20} aria-hidden="true" className="icon-spin" />
        ) : (
          <Menu size={22} aria-hidden="true" />
        )}
        <span>{loading ? 'Abriendo…' : 'Acciones'}</span>
      </button>

      <QuickActionsModal open={open} groups={groups} onClose={() => setOpen(false)} />
    </div>
  );
}
