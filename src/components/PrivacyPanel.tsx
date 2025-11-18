import { useLanguage } from '@contexts/LanguageContext';
import { useTelemetry } from '@contexts/TelemetryContext';

const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' }
] as const;

export function PrivacyPanel() {
  const { preference, setPreference, resetMetrics } = useTelemetry();
  const { currentLang, setLanguage, t } = useLanguage();

  const statusLabel = t(
    'privacy',
    preference === 'granted'
      ? 'statusGranted'
      : preference === 'denied'
        ? 'statusDenied'
        : 'statusUnknown'
  );

  return (
    <section className="privacy-panel" aria-labelledby="privacy-panel-title">
      <div>
        <p id="privacy-panel-title" className="privacy-panel__title">
          {t('privacy', 'title')}
        </p>
        <p className="privacy-panel__text">{t('privacy', 'description')}</p>
      </div>

      <div className="privacy-panel__group">
        <div>
          <p className="privacy-panel__title">{t('privacy', 'telemetryDescription')}</p>
          <p className="privacy-panel__status">{statusLabel}</p>
        </div>
        <div className="privacy-panel__actions">
          <button
            type="button"
            className="privacy-panel__button"
            onClick={() => setPreference('granted')}
          >
            {t('privacy', 'telemetryEnable')}
          </button>
          <button
            type="button"
            className="privacy-panel__button privacy-panel__button--ghost"
            onClick={() => setPreference('denied')}
          >
            {t('privacy', 'telemetryDisable')}
          </button>
          <button
            type="button"
            className="privacy-panel__button privacy-panel__button--ghost"
            onClick={resetMetrics}
          >
            {t('privacy', 'telemetryReset')}
          </button>
        </div>
      </div>

      <div className="privacy-panel__group">
        <div>
          <p className="privacy-panel__title">{t('privacy', 'languageLabel')}</p>
          <p className="privacy-panel__text">{t('privacy', 'languageHelper')}</p>
        </div>
        <select
          className="privacy-panel__select"
          value={currentLang}
          onChange={event => setLanguage(event.target.value as typeof currentLang)}
        >
          {LANGUAGE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
