import { Briefcase, Code, Home, Mail, MoreHorizontal, Rocket } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { KONAMI_DISABLE_MESSAGE, KONAMI_ENABLE_MESSAGE } from '../constants/konami';
import { useDev } from '../contexts/DevContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useConfettiCooldown } from '../hooks/useConfettiCooldown';
import { useCvDownload } from '../hooks/useCvDownload';

import { MobileActionsModal } from './header/MobileActionsModal';

import type { QuickAction, QuickActionGroup } from './header/types';

export default function FloatingQuick() {
  const { data, currentLang, toggleLanguage } = useLanguage();
  const { baseTheme, toggleTheme, isKonami, activateKonami, deactivateKonami } = useTheme();
  const { showToast } = useToast();
  const { devIds, toggleDevIds } = useDev();
  const { activePage, navigateTo } = useNavigation();
  const { tryLaunch: tryLaunchConfetti, isOnCooldown: isConfettiOnCooldown } = useConfettiCooldown({ cooldownMs: 5000, tickMs: 200 });
  const downloadCv = useCvDownload();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleKonamiToggle = useCallback(() => {
    if (isKonami) {
      deactivateKonami();
      showToast(KONAMI_DISABLE_MESSAGE, 'info');
    } else {
      activateKonami();
      showToast(KONAMI_ENABLE_MESSAGE, 'success');
    }
  }, [activateKonami, deactivateKonami, isKonami, showToast]);

  const handleConfettiClick = useCallback(() => {
    const res = tryLaunchConfetti();
    if (!res.launched) {
      const s = Math.ceil(res.remaining / 1000);
      showToast(`Confetti disponible en ${s}s`, 'warning');
    }
  }, [showToast, tryLaunchConfetti]);

  const navActions = useMemo<QuickAction[]>(
    () => data.nav.map(item => ({ key: `nav-${item.id}`, label: item.label, action: () => navigateTo(item.id) })),
    [data.nav, navigateTo]
  );

  const preferenceItems = useMemo<QuickAction[]>(
    () => [
      { key: 'pdf', label: data.tooltips.pdf, action: () => downloadCv({ data }), immediate: true },
      { key: 'confetti', label: data.tooltips.celebrate, action: handleConfettiClick, disabled: isConfettiOnCooldown },
      { key: 'retro', label: isKonami ? 'Salir modo retro' : 'Activar modo retro', action: handleKonamiToggle, immediate: true },
      { key: 'dev-ids', label: devIds ? 'Ocultar IDs dev' : 'Mostrar IDs dev', action: toggleDevIds, immediate: true },
      { key: 'theme', label: baseTheme === 'dark' ? 'Modo claro' : 'Modo oscuro', action: toggleTheme, immediate: true },
      { key: 'language', label: currentLang === 'es' ? 'Switch to English' : 'Cambiar a español', action: toggleLanguage, immediate: true }
    ],
    [
      baseTheme,
      currentLang,
      data,
      devIds,
      downloadCv,
      handleConfettiClick,
      handleKonamiToggle,
      isConfettiOnCooldown,
      isKonami,
      toggleDevIds,
      toggleLanguage,
      toggleTheme
    ]
  );

  const groups = useMemo<QuickActionGroup[]>(
    () => [
      { id: 'nav', label: 'Secciones', items: navActions },
      { id: 'preferences', label: 'Preferencias', items: preferenceItems }
    ],
    [navActions, preferenceItems]
  );

  const CurrentIcon = () => {
    switch (activePage) {
      case 'home':
        return <Home size={20} aria-hidden="true" />;
      case 'experience':
        return <Briefcase size={20} aria-hidden="true" />;
      case 'skills':
        return <Code size={20} aria-hidden="true" />;
      case 'projects':
        return <Rocket size={20} aria-hidden="true" />;
      case 'contact':
        return <Mail size={20} aria-hidden="true" />;
      default:
        return <Home size={20} aria-hidden="true" />;
    }
  };

  return (
    <>
      <div className="floating-quick" data-dev-id="1200" aria-label="Accesos rápidos">
        <button
          type="button"
          className="icon-btn"
          aria-label={currentLang === 'es' ? 'Ir a inicio' : 'Go home'}
          onClick={() => navigateTo('home')}
          onPointerDown={(e) => { /* evitar que se pierda el primer tap */ e.stopPropagation(); }}
        >
          <CurrentIcon />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-quick-actions"
          aria-label={currentLang === 'es' ? 'Abrir acciones' : 'Open actions'}
          onClick={() => setOpen(true)}
          onTouchStart={(e) => { e.preventDefault(); setOpen(true); }}
          onPointerDown={(e) => { e.stopPropagation(); setOpen(true); }}
        >
          <MoreHorizontal size={20} aria-hidden="true" />
        </button>
      </div>
      <MobileActionsModal open={open} groups={groups} onClose={() => setOpen(false)} menuRef={menuRef} />
    </>
  );
}
