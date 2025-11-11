import { Loader2, Menu } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { KONAMI_DISABLE_MESSAGE, KONAMI_ENABLE_MESSAGE } from '../constants/konami';
import { useDev } from '../contexts/DevContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useConfettiCooldown } from '../hooks/useConfettiCooldown';
import { useCvDownload } from '../hooks/useCvDownload';

import { QuickActionsModal } from './QuickActionsModal';

import type { QuickAction, QuickActionGroup } from './quick-actions/types';

export default function QuickActionsMenu() {
  const { data, currentLang, toggleLanguage } = useLanguage();
  const { navigateTo } = useNavigation();
  const { baseTheme, toggleTheme, isKonami, activateKonami, deactivateKonami } = useTheme();
  const { devIds, toggleDevIds } = useDev();
  const { showToast } = useToast();
  const { tryLaunch: tryLaunchConfetti, isOnCooldown: isConfettiOnCooldown } = useConfettiCooldown({
    cooldownMs: 5000,
    tickMs: 200
  });
  const downloadCv = useCvDownload();

  const [open, setOpen] = useState(false);
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

  const handleConfettiClick = useCallback(() => {
    const result = tryLaunchConfetti();
    if (!result.launched) {
      const seconds = Math.ceil(result.remaining / 1000);
      showToast(`Confetti disponible en ${seconds}s`, 'warning');
    }
  }, [showToast, tryLaunchConfetti]);

  const handleKonamiToggle = useCallback(() => {
    if (isKonami) {
      deactivateKonami();
      showToast(KONAMI_DISABLE_MESSAGE, 'info');
    } else {
      activateKonami();
      showToast(KONAMI_ENABLE_MESSAGE, 'success');
    }
  }, [activateKonami, deactivateKonami, isKonami, showToast]);

  const navActions = useMemo<QuickAction[]>(() => {
    return (data.nav ?? []).map(item => ({
      key: `nav-${item.id}`,
      label: item.label,
      action: () => {
        navigateTo(item.id);
        setOpen(false);
      },
      immediate: true
    }));
  }, [data.nav, navigateTo]);

  const preferenceItems = useMemo<QuickAction[]>(() => {
    return [
      { key: 'pdf', label: data.tooltips.pdf, action: () => downloadCv({ data }), immediate: true },
      {
        key: 'confetti',
        label: data.tooltips.celebrate,
        action: handleConfettiClick,
        disabled: isConfettiOnCooldown
      },
      {
        key: 'retro',
        label: isKonami ? 'Salir modo retro' : 'Activar modo retro',
        action: handleKonamiToggle,
        immediate: true
      },
      {
        key: 'dev-ids',
        label: devIds ? 'Ocultar IDs de inspección' : 'Mostrar IDs de inspección',
        action: toggleDevIds,
        immediate: true
      },
      {
        key: 'theme',
        label: baseTheme === 'dark' ? 'Modo claro' : 'Modo oscuro',
        action: toggleTheme,
        immediate: true
      },
      {
        key: 'language',
        label: currentLang === 'es' ? 'Switch to English' : 'Cambiar a español',
        action: toggleLanguage,
        immediate: true
      }
    ];
  }, [baseTheme, currentLang, data, devIds, downloadCv, handleConfettiClick, handleKonamiToggle, isConfettiOnCooldown, isKonami, toggleDevIds, toggleLanguage, toggleTheme]);

  const groups = useMemo<QuickActionGroup[]>(() => {
    const result: QuickActionGroup[] = [];
    if (navActions.length) {
      result.push({ id: 'nav', label: 'Secciones', items: navActions });
    }
    result.push({ id: 'preferences', label: 'Preferencias', items: preferenceItems });
    return result;
  }, [navActions, preferenceItems]);

  return (
    <div className="quick-menu" data-position="bottom-right" data-dev-id="1200">
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
