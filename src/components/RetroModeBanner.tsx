import { Sparkles } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onExitRetro: () => void;
}

export function RetroModeBanner({ onExitRetro }: Props) {
  const { data } = useLanguage();

  return (
    <div className="retro-banner" role="status" aria-live="polite">
      <Sparkles aria-hidden="true" className="retro-banner__icon" />
      <span className="retro-banner__text">{data.ui.retroActiveLabel}</span>
      <button type="button" className="retro-banner__button" onClick={onExitRetro} data-retro-sfx>
        {data.ui.retroExit}
      </button>
    </div>
  );
}
