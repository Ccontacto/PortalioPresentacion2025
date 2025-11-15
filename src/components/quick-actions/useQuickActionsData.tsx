import {
  Download,
  Github,
  Languages,
  Linkedin,
  Link2,
  Mail,
  MessageSquare,
  PartyPopper,
  Sparkles,
  Wrench
} from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { KONAMI_DISABLE_MESSAGE, KONAMI_ENABLE_MESSAGE } from '../../constants/konami';
import { THEME_META, getThemeLabel } from '../../constants/themeMeta';
import { useDev } from '../../contexts/DevContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BASE_THEME_ORDER, useTheme } from '../../contexts/ThemeContext';
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
      celebrate: data?.tooltips?.celebrate ?? 'Celebrar',
      language: data?.tooltips?.language ?? 'ES',
      theme: data?.tooltips?.theme ?? 'Tema',
      linkedin: data?.tooltips?.linkedin ?? 'LinkedIn',
      github: data?.tooltips?.github ?? 'GitHub',
      email: data?.tooltips?.email ?? 'Email',
      whatsapp: data?.tooltips?.whatsapp ?? 'WhatsApp'
    };
  }, [data?.tooltips]);

  const invalidUrlMessage = data?.toasts?.invalid_url ?? 'Enlace no disponible.';
  const openExternalLink = useCallback(
    (url?: string) => {
      if (!url) {
        showToast(invalidUrlMessage, 'warning');
        return;
      }

      if (typeof window === 'undefined') {
        showToast('Abriendo enlace...', 'info');
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [invalidUrlMessage, showToast]
  );

  const openMail = useCallback(() => {
    if (!data?.email) {
      showToast(invalidUrlMessage, 'warning');
      return;
    }

    if (typeof window === 'undefined') {
      showToast('Preparando correo...', 'info');
      return;
    }

    window.open(`mailto:${data.email}`, '_blank');
  }, [data?.email, invalidUrlMessage, showToast]);

  const whatsappLink = useMemo(() => {
    const raw = data?.whatsapp ?? '';
    const digits = raw.replace(/\D+/g, '');
    return digits ? `https://wa.me/${digits}` : undefined;
  }, [data?.whatsapp]);

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
    const socials: QuickAction[] = [
      {
        key: 'github',
        label: tooltips.github,
        action: () => openExternalLink(data?.social?.github),
        icon: <Github size={18} aria-hidden />
      },
      {
        key: 'linkedin',
        label: tooltips.linkedin,
        action: () => openExternalLink(data?.social?.linkedin),
        icon: <Linkedin size={18} aria-hidden />
      },
      ...(data?.social?.portfolio
        ? [
            {
              key: 'portfolio',
              label: data.lang === 'en' ? 'Visit portfolio' : 'Visitar sitio',
              action: () => openExternalLink(data.social?.portfolio),
              icon: <Link2 size={18} aria-hidden />
            }
          ]
        : [])
    ];

    const contactActions: QuickAction[] = [
      {
        key: 'email',
        label: tooltips.email,
        action: openMail,
        icon: <Mail size={18} aria-hidden />
      },
      ...(whatsappLink
        ? [
            {
              key: 'whatsapp',
              label: tooltips.whatsapp,
              action: () => openExternalLink(whatsappLink),
              icon: <MessageSquare size={18} aria-hidden />
            }
          ]
        : [])
    ];

    const currentThemeIndex = BASE_THEME_ORDER.indexOf(baseTheme);
    const nextTheme = BASE_THEME_ORDER[(currentThemeIndex + 1) % BASE_THEME_ORDER.length];
    const nextThemeCopy =
      data?.lang === 'en'
        ? `Switch to ${getThemeLabel('en', nextTheme)}`
        : `Cambiar a ${getThemeLabel('es', nextTheme)}`;

    const systemActions: QuickAction[] = [
      {
        key: 'pdf',
        label: tooltips.pdf,
        action: () => downloadCv({ data }),
        immediate: true,
        icon: <Download size={18} aria-hidden />
      },
      {
        key: 'theme',
        label: nextThemeCopy,
        action: toggleTheme,
        immediate: true,
        icon: THEME_META[nextTheme].icon
      },
      {
        key: 'language',
        label: currentLang === 'es' ? 'Switch to English' : 'Cambiar a español',
        action: toggleLanguage,
        immediate: true,
        icon: <Languages size={18} aria-hidden />
      }
    ];

    const extras: QuickAction[] = [
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
      }
    ];

    return [...systemActions, ...socials, ...contactActions, ...extras];
  }, [
    baseTheme,
    currentLang,
    data,
    devIds,
    downloadCv,
    handleConfettiClick,
    handleKonamiToggle,
    isConfettiOnCooldown,
    isKonami,
    openExternalLink,
    openMail,
    toggleDevIds,
    toggleLanguage,
    toggleTheme,
    tooltips.celebrate,
    tooltips.email,
    tooltips.github,
    tooltips.linkedin,
    tooltips.pdf,
    tooltips.whatsapp,
    whatsappLink
  ]);

  return {
    navItems,
    preferenceItems
  };
}
