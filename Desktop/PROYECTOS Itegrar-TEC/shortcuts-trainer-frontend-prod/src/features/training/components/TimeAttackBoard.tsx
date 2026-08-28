import { useEffect, useState } from 'react';
import { Timer, RotateCcw } from 'lucide-react';
import { useShortcutStore } from '../useShortcutStore';
import { useGlobalKeydown } from '../hooks/useGlobalKeydown';
import { ShortcutCard } from './ShortcutCard';
import { useTranslation } from '@/features/translation/useTranslation';
import { fireStreakConfetti } from '@/shared/utils/confetti';
import { playCorrectSound, playWrongSound } from '@/shared/utils/sound';

const DURATION = 60;

/**
 * Modo contrarreloj: 60s, muestra la descripción (sin teclas) y se
 * cuentan los atajos acertados. No toca el store de progreso.
 */
export function TimeAttackBoard({ tool }: { tool: string }) {
  const { t } = useTranslation();
  const currentShortcut = useShortcutStore((s) => s.currentShortcut);
  const selectedLevel = useShortcutStore((s) => s.selectedLevel);
  const nextShortcut = useShortcutStore((s) => s.nextShortcut);

  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    nextShortcut(tool);
  }, [tool, selectedLevel, nextShortcut]);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  useEffect(() => {
    if (finished) fireStreakConfetti();
  }, [finished]);

  useGlobalKeydown({
    shortcut: currentShortcut,
    enabled: !finished && currentShortcut !== null,
    onMatch: () => {
      playCorrectSound();
      setScore((s) => s + 1);
      nextShortcut(tool);
    },
    onMismatch: () => playWrongSound(),
  });

  const restart = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setFinished(false);
    nextShortcut(tool);
  };

  if (finished) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-md flex flex-col items-center gap-4 bg-slate-900/70 light:bg-white/80 p-10 rounded-2xl border border-slate-800 light:border-slate-200 shadow-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('¡Tiempo!')}</p>
        <p className="text-6xl font-extrabold text-sky-400 light:text-sky-600 tabular-nums">{score}</p>
        <p className="text-slate-400 light:text-slate-600">{t('aciertos')}</p>
        <button
          type="button"
          onClick={restart}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/15 light:bg-sky-50 border border-sky-500/50 text-sky-300 light:text-sky-700 text-sm font-semibold hover:bg-sky-500/25 transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden />
          {t('Jugar de nuevo')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="flex items-center gap-6 text-lg font-bold tabular-nums">
        <span
          className={cnTimer(timeLeft)}
          aria-label={timeLeft <= 10 ? t('Quedan pocos segundos') : undefined}
        >
          <Timer className="w-5 h-5" aria-hidden />
          {timeLeft}s
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-400 light:text-emerald-600">
          <span aria-hidden>✓</span>
          <span className="sr-only">{t('Aciertos')}: </span>
          {score}
        </span>
      </div>

      {currentShortcut ? (
        <ShortcutCard shortcut={currentShortcut} reveal={false} />
      ) : (
        <p className="text-slate-400 light:text-slate-600">
          {t('No hay atajos registrados para esta herramienta todavía.')}
        </p>
      )}

      <p className="text-xs text-slate-500">{t('Tocá el atajo lo más rápido que puedas')}</p>
    </div>
  );
}

function cnTimer(timeLeft: number): string {
  const base = 'inline-flex items-center gap-2';
  return timeLeft <= 10
    ? `${base} text-red-400 light:text-red-600`
    : `${base} text-slate-200 light:text-slate-800`;
}
