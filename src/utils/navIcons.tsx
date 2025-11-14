import { Briefcase, Contact, Home, Layers, Package, Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';

export function navIconFor(id: string): ReactElement {
  switch (id) {
    case 'home':
      return <Home size={18} aria-hidden />;
    case 'experience':
      return <Briefcase size={18} aria-hidden />;
    case 'skills':
      return <Layers size={18} aria-hidden />;
    case 'projects':
      return <Package size={18} aria-hidden />;
    case 'contact':
      return <Contact size={18} aria-hidden />;
    default:
      return <Sparkles size={18} aria-hidden />;
  }
}
