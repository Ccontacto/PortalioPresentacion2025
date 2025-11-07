import { useNavigation } from '../contexts/NavigationContext';
import { Home, Briefcase, Code, Rocket, Mail } from 'lucide-react';

export default function PageIndicator() {
  const { activePage } = useNavigation();

  const icon = (() => {
    switch (activePage) {
      case 'home':
        return <Home size={18} aria-hidden="true" />;
      case 'experience':
        return <Briefcase size={18} aria-hidden="true" />;
      case 'skills':
        return <Code size={18} aria-hidden="true" />;
      case 'projects':
        return <Rocket size={18} aria-hidden="true" />;
      case 'contact':
        return <Mail size={18} aria-hidden="true" />;
      default:
        return <Home size={18} aria-hidden="true" />;
    }
  })();

  return (
    <div
      className="page-indicator"
      data-dev-id="8600"
      role="status"
      aria-live="polite"
      aria-label={`Sección actual: ${activePage}`}
      title={activePage}
    >
      {icon}
    </div>
  );
}
