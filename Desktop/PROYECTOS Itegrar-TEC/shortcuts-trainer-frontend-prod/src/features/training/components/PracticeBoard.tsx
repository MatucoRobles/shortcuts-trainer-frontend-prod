import { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { useShortcutStore } from '../useShortcutStore';
import { useGlobalKeydown } from '../hooks/useGlobalKeydown';
import { useFeedback } from '../hooks/useFeedback';
import { ShortcutCard } from './ShortcutCard';
import { SessionStats } from './SessionStats';
import { cn } from '@/shared/utils/cn';
import { useProgressStore } from '../../progress/progressStore';
import { getAverageResponseTime, filterByTool } from '../utils';
import { useTranslation } from '@/features/translation/useTranslation';
import { toast } from 'sonner';
import { fireStreakConfetti } from '@/shared/utils/confetti';
import { playCorrectSound, playWrongSound } from '@/shared/utils/sound';

interface PracticeBoardProps {
  tool: string;
  /** true = modo Aprender (muestra las teclas); false = Adivinar. */
  reveal: boolean;
}

/**
 * Tablero de práctica con captura de teclado. En `reveal` muestra el
 * atajo; sin `reveal` lo oculta (Adivinar). Registra métricas en el
 * store de progreso al desmontar.
 */
export function PracticeBoard({ tool, reveal }: PracticeBoardProps) {
  const { t } = useTranslation();
  const currentShortcut = useShortcutStore((s) => s.currentShortcut);
  const shortcuts = useShortcutStore((s) => s.shortcuts);
  const selectedLevel = useShortcutStore((s) => s.selectedLevel);
  const nextShortcut = useShortcutStore((s) => s.nextShortcut);
  const recordAttempt = useShortcutStore((s) => s.recordAttempt);
  const resetStats = useShortcutStore((s) => s.resetStats);
  const currentStreak = useShortcutStore((s) => s.currentStreak);
  const { status, triggerCorrect, triggerWrong } = useFeedback();
  const updateRecord = useProgressStore((s) => s.updateRecord);

  useEffect(() => {
    resetStats();
    return () => {
      const state = useShortcutStore.getState();
      updateRecord(tool, {
        correct: state.correctAttempts,
        wrong: state.wrongAttempts,
        streak: state.currentStreak,
        avgResponseTime: getAverageResponseTime(state.responseTimes),
        masteredIds:
          state.currentStreak >= 2 ? [state.currentShortcut?.id ?? ''].filter(Boolean) : [],
      });
      resetStats();
    };
  }, [tool, resetStats, updateRecord]);

  const shownAtRef = useRef<number>(performance.now());
  useEffect(() => {
    shownAtRef.current = performance.now();
  }, [currentShortcut]);

  const prevStreakRef = useRef(0);
  useEffect(() => {
    const prev = prevStreakRef.current;
    if (currentStreak > prev && currentStreak > 0 && currentStreak % 10 === 0) {
      fireStreakConfetti();
      toast.success(`🔥 ${t('Racha')} ${currentStreak}`, {
        description: t('¡Estás imparable!'),
      });
    }
    prevStreakRef.current = currentStreak;
  }, [currentStreak, t]);

  useGlobalKeydown({
    shortcut: currentShortcut,
    enabled: currentShortcut !== null,
    onMatch: () => {
      const elapsed = performance.now() - shownAtRef.current;
      recordAttempt(true, elapsed);
      triggerCorrect();
      playCorrectSound();
      nextShortcut(tool);
    },
    onMismatch: () => {
      const elapsed = performance.now() - shownAtRef.current;
      recordAttempt(false, elapsed);
      triggerWrong();
      playWrongSound();
    },
  });

  useEffect(() => {
    nextShortcut(tool);
  }, [tool, nextShortcut]);

  useEffect(() => {
    nextShortcut(tool);
  }, [selectedLevel, tool, nextShortcut]);

  const handleSkip = () => nextShortcut(tool);

  if (!currentShortcut) {
    return (
      <p className="text-slate-400 light:text-slate-600">
        {t('No hay atajos registrados para esta herramienta todavía.')}
      </p>
    );
  }

  return (
    <>
      <div
        className={cn(
          'w-full max-w-2xl rounded-2xl transition-all duration-300',
          status === 'correct' &&
            'ring-2 ring-emerald-500 shadow-[0_0_24px_2px_rgba(16,185,129,0.25)]',
          status === 'wrong' &&
            'ring-2 ring-red-500 shadow-[0_0_24px_2px_rgba(239,68,68,0.25)]',
        )}
      >
        <ShortcutCard shortcut={currentShortcut} reveal={reveal} />
      </div>

      <p role="status" aria-live="assertive" className="sr-only">
        {status === 'correct'
          ? t('¡Correcto!')
          : status === 'wrong'
            ? t('Incorrecto, intentá de nuevo')
            : ''}
      </p>

      <SessionStats tool={tool} totalShortcuts={filterByTool(shortcuts, tool).length} />

      <button
        type="button"
        onClick={handleSkip}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-700 text-sm font-medium hover:border-sky-500 hover:text-sky-400 transition-colors"
      >
        <RotateCcw className="w-4 h-4" aria-hidden />
        {t('Saltar atajo')}
      </button>

      <p className="text-xs text-slate-500 max-w-md text-center">
        {t('Tip: si tu navegador intercepta la combinación (por ejemplo, Ctrl+S), presiona')}{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 light:bg-slate-200 border border-slate-700 light:border-slate-300">
          Esc
        </kbd>{' '}
        {t('después de intentar para liberar la captura.')}
      </p>
    </>
  );
}
