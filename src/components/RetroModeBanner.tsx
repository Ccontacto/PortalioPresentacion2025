import { Sparkles } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onExitRetro: () => void;
}

export function RetroModeBanner({ onExitRetro }: Props) {
  const { data } = useLanguage();
  const ui = (data as { ui?: { retroActiveLabel?: string; retroExit?: string } }).ui ?? {};

  return (
    <div className="retro-banner" role="status" aria-live="polite">
      <Sparkles aria-hidden="true" className="retro-banner__icon" />
      <span className="retro-banner__text">{ui.retroActiveLabel ?? 'Modo retro activo'}</span>
      <button type="button" className="retro-banner__button" onClick={onExitRetro} data-retro-sfx>
        {ui.retroExit ?? 'Salir de modo retro'}
      </button>
    </div>
  );
}
