import Icon from '@components/icons/VectorIcon';
import { m, AnimatePresence } from 'framer-motion';

import { useToast } from '../contexts/ToastContext';

import type { JSX } from 'react';

const icons: Record<string, JSX.Element> = {
  info: <Icon name="info" size={24} aria-hidden />,
  success: <Icon name="checkCircle" size={24} aria-hidden />,
  error: <Icon name="xCircle" size={24} aria-hidden />,
  warning: <Icon name="info" size={24} aria-hidden />
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    // MEJORA 5: role, aria-label y aria-live
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2"
      data-dev-id="8602"
      role="region"
      aria-label="Notificaciones del sistema"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <m.div
            key={toast.id}
            // MEJORA 5: role="status" en cada toast
            role="status"
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {icons[toast.type]}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1"
              aria-label="Cerrar notificación"
            >
              <Icon name="close" size={24} aria-hidden />
            </button>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
