import { useLanguage } from '@contexts/LanguageContext';
import { useTelemetry } from '@contexts/TelemetryContext';

const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' }
] as const;

export function PrivacyPanel() {
  const { preference, setPreference, resetMetrics } = useTelemetry();
  const { currentLang, toggleLanguage } = useLanguage();
  const isEnglish = currentLang === 'en';

  const strings = {
    title: isEnglish ? 'Privacy & preferences' : 'Privacidad y preferencias',
    description: isEnglish
      ? 'Control your language and anonymous telemetry from here.'
      : 'Controla tu idioma y la telemetría anónima desde este panel.',
    telemetryDescription: isEnglish ? 'Section telemetry' : 'Telemetría de secciones',
    telemetryEnable: isEnglish ? 'Enable' : 'Activar',
    telemetryDisable: isEnglish ? 'Disable' : 'Desactivar',
    telemetryReset: isEnglish ? 'Clear metrics' : 'Borrar métricas',
    languageLabel: isEnglish ? 'Portfolio language' : 'Idioma del portafolio',
    languageHelper: isEnglish
      ? 'Choose the language you prefer for this experience.'
      : 'Elige el idioma que prefieras para esta experiencia.',
    statusGranted: isEnglish ? 'Telemetry enabled' : 'Telemetría activada',
    statusDenied: isEnglish ? 'Telemetry disabled' : 'Telemetría desactivada',
    statusUnknown: isEnglish ? 'Pending your decision' : 'Pendiente de tu decisión'
  };

  const statusLabel =
    preference === 'granted'
      ? strings.statusGranted
      : preference === 'denied'
        ? strings.statusDenied
        : strings.statusUnknown;

  const handleLanguageChange = (value: typeof currentLang) => {
    if (value !== currentLang) {
      toggleLanguage();
    }
  };

  return (
    <section className="privacy-panel" aria-labelledby="privacy-panel-title">
      <div>
        <p id="privacy-panel-title" className="privacy-panel__title">
          {strings.title}
        </p>
        <p className="privacy-panel__text">{strings.description}</p>
      </div>

      <div className="privacy-panel__group">
        <div>
          <p className="privacy-panel__title">{strings.telemetryDescription}</p>
          <p className="privacy-panel__status">{statusLabel}</p>
        </div>
        <div className="privacy-panel__actions">
          <button
            type="button"
            className="privacy-panel__button"
            onClick={() => setPreference('granted')}
          >
            {strings.telemetryEnable}
          </button>
          <button
            type="button"
            className="privacy-panel__button privacy-panel__button--ghost"
            onClick={() => setPreference('denied')}
          >
            {strings.telemetryDisable}
          </button>
          <button
            type="button"
            className="privacy-panel__button privacy-panel__button--ghost"
            onClick={resetMetrics}
          >
            {strings.telemetryReset}
          </button>
        </div>
      </div>

      <div className="privacy-panel__group">
        <div>
          <p className="privacy-panel__title">{strings.languageLabel}</p>
          <p className="privacy-panel__text">{strings.languageHelper}</p>
        </div>
        <select
          className="privacy-panel__select"
          value={currentLang}
          onChange={event => handleLanguageChange(event.target.value as typeof currentLang)}
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
