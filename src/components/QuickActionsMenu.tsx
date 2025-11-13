import { Sparkles } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { QuickActionsModal } from './QuickActionsModal';
import { useQuickActionsData } from './quick-actions/useQuickActionsData';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { navIconFor } from '../utils/navIcons';
import type { QuickActionGroup } from './quick-actions/types';

export default function QuickActionsMenu() {
  const [open, setOpen] = useState(false);
  const { data } = useLanguage();
  const { navItems, preferenceItems } = useQuickActionsData();
  const { navigateTo } = useNavigation();

  const handleNavigate = useCallback(
    (id: string) => {
      navigateTo(id);
      setOpen(false);
    },
    [navigateTo]
  );

  const sectionsLabel = data.ui.quickSectionsLabel ?? (data.lang === 'en' ? 'Sections' : 'Secciones');
  const preferencesLabel = data.ui.quickPreferencesLabel ?? (data.lang === 'en' ? 'Preferences' : 'Preferencias');
  const quickActionsTitle = data.ui.quickActionsTitle ?? (data.lang === 'en' ? 'Quick actions' : 'Acciones rápidas');

  const groups = useMemo<QuickActionGroup[]>(() => {
    const result: QuickActionGroup[] = [];
    if (navItems.length) {
      result.push({
        id: 'quick-sections',
        label: sectionsLabel,
        items: navItems.map(nav => ({
          key: `nav-${nav.id}`,
          label: nav.label,
          icon: navIconFor(nav.id),
          action: () => handleNavigate(nav.id)
        }))
      });
    }
    if (preferenceItems.length) {
      result.push({
        id: 'quick-preferences',
        label: preferencesLabel,
        items: preferenceItems
      });
    }
    return result;
  }, [navItems, preferenceItems, sectionsLabel, preferencesLabel, handleNavigate]);

  if (!groups.length) {
    return null;
  }

  return (
    <div className="quick-menu" data-position="top-right">
      <button
        type="button"
        className="quick-menu-button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={quickActionsTitle}
        data-dev-id="1400"
      >
        <Sparkles size={20} aria-hidden />
        <span>{quickActionsTitle}</span>
      </button>
      <QuickActionsModal open={open} groups={groups} onClose={() => setOpen(false)} />
    </div>
  );
}
