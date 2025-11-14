import { Download, Languages, Moon, PartyPopper, Sparkles, Sun, Wrench } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { KONAMI_DISABLE_MESSAGE, KONAMI_ENABLE_MESSAGE } from '../../constants/konami';
import { useDev } from '../../contexts/DevContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfettiCooldown } from '../../hooks/useConfettiCooldown';
import { useCvDownload } from '../../hooks/useCvDownload';

import type { QuickAction } from './types';

type NavEntry = { id: string; label: string };

export function useQuickActionsData() {
  const { data, currentLang, toggleLanguage } = useLanguage();
  const { baseTheme, toggleTheme, isKonami, activateKonami, deactivateKonami } = useTheme();
  const { devIds, toggleDevIds } = useDev();
  const { showToast } = useToast();
  const { tryLaunch: tryLaunchConfetti, isOnCooldown: isConfettiOnCooldown } = useConfettiCooldown({
    cooldownMs: 5000,
    tickMs: 200
  });
  const downloadCv = useCvDownload();

  const navItems = useMemo<NavEntry[]>(() => {
    return Array.isArray(data?.nav)
      ? data.nav.filter((item): item is NavEntry => Boolean(item?.id && item?.label))
      : [];
  }, [data?.nav]);

  const tooltips = useMemo(() => {
    return {
      pdf: data?.tooltips?.pdf ?? 'Descargar CV',
      celebrate: data?.tooltips?.celebrate ?? 'Celebrar'
    };
  }, [data?.tooltips]);

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

  const preferenceItems = useMemo<QuickAction[]>(() => {
    return [
      { key: 'pdf', label: tooltips.pdf, action: () => downloadCv({ data }), immediate: true, icon: <Download size={18} aria-hidden /> },
      {
        key: 'confetti',
        label: tooltips.celebrate,
        action: handleConfettiClick,
        disabled: isConfettiOnCooldown,
        icon: <PartyPopper size={18} aria-hidden />
      },
      {
        key: 'retro',
        label: isKonami ? 'Salir modo retro' : 'Activar modo retro',
        action: handleKonamiToggle,
        immediate: true,
        icon: <Sparkles size={18} aria-hidden />
      },
      {
        key: 'dev-ids',
        label: devIds ? 'Ocultar IDs de inspección' : 'Mostrar IDs de inspección',
        action: toggleDevIds,
        immediate: true,
        icon: <Wrench size={18} aria-hidden />
      },
      {
        key: 'theme',
        label: baseTheme === 'dark' ? 'Modo claro' : 'Modo oscuro',
        action: toggleTheme,
        immediate: true,
        icon: baseTheme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />
      },
      {
        key: 'language',
        label: currentLang === 'es' ? 'Switch to English' : 'Cambiar a español',
        action: toggleLanguage,
        immediate: true,
        icon: <Languages size={18} aria-hidden />
      }
    ];
  }, [baseTheme, currentLang, data, devIds, downloadCv, handleConfettiClick, handleKonamiToggle, isConfettiOnCooldown, isKonami, toggleDevIds, toggleLanguage, toggleTheme, tooltips.pdf, tooltips.celebrate]);

  return {
    navItems,
    preferenceItems
  };
}
