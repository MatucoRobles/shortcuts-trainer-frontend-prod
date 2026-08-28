import { useTranslation } from '@/features/translation/useTranslation';
import { PillToggle } from '@/shared/components/PillToggle';
import { useModeStore, type TrainingMode } from '../modeStore';

const MODES: ReadonlyArray<{ value: TrainingMode; label: string }> = [
  { value: 'learn', label: 'Aprender' },
  { value: 'guess', label: 'Adivinar' },
  { value: 'choice', label: 'Opción múltiple' },
  { value: 'timeattack', label: 'Contrarreloj' },
];

export function ModeSelector() {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);

  return (
    <div
      role="group"
      aria-label={t('Modo de entrenamiento')}
      className="flex items-center gap-2 flex-wrap justify-center"
    >
      {MODES.map((m) => (
        <PillToggle key={m.value} active={mode === m.value} onClick={() => setMode(m.value)}>
          {t(m.label)}
        </PillToggle>
      ))}
    </div>
  );
}
