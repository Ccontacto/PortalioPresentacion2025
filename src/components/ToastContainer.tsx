import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { Info, CheckCircle, XCircle, X } from 'lucide-react';

const icons: Record<string, JSX.Element> = {
  info: <Info size={24} aria-hidden="true" />,
  success: <CheckCircle size={24} aria-hidden="true" />,
  error: <XCircle size={24} aria-hidden="true" />,
  warning: <Info size={24} aria-hidden="true" />
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    // MEJORA 5: role, aria-label y aria-live
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notificaciones del sistema"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
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
              className="hit-44"
              aria-label="Cerrar notificación"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
