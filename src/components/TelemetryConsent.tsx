import { useLanguage } from '@contexts/LanguageContext';
import { useTelemetry } from '@contexts/TelemetryContext';

import type { TelemetryPreference } from '@contexts/TelemetryContext';

export function TelemetryConsent() {
  const { preference, setPreference } = useTelemetry();
  const { data } = useLanguage();
  const isEnglish = data.lang === 'en';

  if (preference !== 'unknown') {
    return null;
  }

  const handleChoice = (choice: TelemetryPreference) => {
    setPreference(choice);
  };

  return (
    <aside className="telemetry-consent" role="alert" aria-live="polite">
      <div className="telemetry-consent__body">
        <p className="telemetry-consent__title">
          {isEnglish ? 'May I measure usage?' : '¿Podemos medir el uso?'}
        </p>
        <p className="telemetry-consent__text">
          {isEnglish
            ? 'I use anonymous metrics to prioritize sections and improve the experience.'
            : 'Uso métricas anónimas para priorizar secciones y mejorar la experiencia.'}
        </p>
      </div>
      <div className="telemetry-consent__actions">
        <button type="button" onClick={() => handleChoice('granted')} className="telemetry-consent__button">
          {isEnglish ? 'Allow analytics' : 'Permitir analíticas'}
        </button>
        <button
          type="button"
          onClick={() => handleChoice('denied')}
          className="telemetry-consent__button telemetry-consent__button--ghost"
        >
          {isEnglish ? 'No thanks' : 'No, gracias'}
        </button>
      </div>
    </aside>
  );
}
