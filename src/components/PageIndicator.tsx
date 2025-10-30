import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function PageIndicator() {
  const { activePage } = useNavigation();
  const { data } = useLanguage();

  const current = data.nav.find(n => n.id === activePage)?.label || activePage;

  return (
    <div className="page-indicator" role="status" aria-live="polite" aria-label={`Sección actual: ${current}`}>
      {current}
    </div>
  );
}
