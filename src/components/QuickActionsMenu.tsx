import { Menu } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

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
    <div className="quick-menu" data-dev-id="1200">
      <button
        type="button"
        className="quick-menu-button"
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-controls="quick-actions-modal"
        aria-expanded={open}
        aria-label="Abrir menú de acciones"
      >
        <Menu size={22} aria-hidden="true" />
        <span>Acciones</span>
      </button>

      <QuickActionsModal open={open} groups={groups} onClose={() => setOpen(false)} />
    </div>
  );
}
