import { useLanguage } from '@contexts/LanguageContext';
import { useTelemetry } from '@contexts/TelemetryContext';

import type { TelemetryPreference } from '@contexts/TelemetryContext';

export function TelemetryConsent() {
  const { preference, setPreference } = useTelemetry();
  const { t } = useLanguage();

  if (preference !== 'unknown') {
    return null;
  }

  const handleChoice = (choice: TelemetryPreference) => {
    setPreference(choice);
  };

  return (
    <aside className="telemetry-consent" role="alert" aria-live="polite">
      <div className="telemetry-consent__body">
        <p className="telemetry-consent__title">{t('telemetry', 'title')}</p>
        <p className="telemetry-consent__text">{t('telemetry', 'description')}</p>
      </div>
      <div className="telemetry-consent__actions">
        <button type="button" onClick={() => handleChoice('granted')} className="telemetry-consent__button">
          {t('telemetry', 'accept')}
        </button>
        <button
          type="button"
          onClick={() => handleChoice('denied')}
          className="telemetry-consent__button telemetry-consent__button--ghost"
        >
          {t('telemetry', 'decline')}
        </button>
      </div>
    </aside>
  );
}
