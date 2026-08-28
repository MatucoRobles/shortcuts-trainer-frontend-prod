import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useShortcutStore } from '../useShortcutStore';
import { KeyCap } from '@/shared/components/KeyCap';
import { SessionStats } from './SessionStats';
import { useThemeStore } from '@/features/theme/useThemeStore';
import { useTranslation } from '@/features/translation/useTranslation';
import { cn } from '@/shared/utils/cn';
import { formatKeyLabel, filterByTool, getAverageResponseTime } from '../utils';
import { useProgressStore } from '../../progress/progressStore';
import { playCorrectSound, playWrongSound } from '@/shared/utils/sound';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Modo opción múltiple: muestra la combinación y el usuario elige cuál
 * de las descripciones es la correcta. No requiere teclado (sirve en
 * móvil). Registra métricas en el store igual que el modo Aprender.
 */
export function ChoiceBoard({ tool }: { tool: string }) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.mode === 'dark');
  const shortcuts = useShortcutStore((s) => s.shortcuts);
  const selectedLevel = useShortcutStore((s) => s.selectedLevel);
  const currentShortcut = useShortcutStore((s) => s.currentShortcut);
  const nextShortcut = useShortcutStore((s) => s.nextShortcut);
  const recordAttempt = useShortcutStore((s) => s.recordAttempt);
  const resetStats = useShortcutStore((s) => s.resetStats);
  const updateRecord = useProgressStore((s) => s.updateRecord);

  const pool = useMemo(() => {
    let p = shortcuts.filter((s) => s.tool === tool);
    if (selectedLevel !== null) p = p.filter((s) => s.level === selectedLevel);
    return p;
  }, [shortcuts, tool, selectedLevel]);

  useEffect(() => {
    resetStats();
    nextShortcut(tool);
    return () => {
      const state = useShortcutStore.getState();
      updateRecord(tool, {
        correct: state.correctAttempts,
        wrong: state.wrongAttempts,
        streak: state.currentStreak,
        avgResponseTime: getAverageResponseTime(state.responseTimes),
        masteredIds: [],
      });
      resetStats();
    };
  }, [tool, selectedLevel, nextShortcut, resetStats, updateRecord]);

  const shownAtRef = useRef<number>(performance.now());
  useEffect(() => {
    shownAtRef.current = performance.now();
  }, [currentShortcut]);

  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<ReadonlySet<string>>(new Set());

  const options = useMemo(() => {
    if (!currentShortcut) return [];
    const others = pool.filter((s) => s.id !== currentShortcut.id).map((s) => s.description);
    const distractors = shuffle(Array.from(new Set(others))).slice(0, 3);
    return shuffle([currentShortcut.description, ...distractors]);
  }, [currentShortcut, pool]);

  useEffect(() => {
    setSolved(false);
    setWrong(new Set());
  }, [currentShortcut]);

  if (!currentShortcut) {
    return (
      <p className="text-slate-400 light:text-slate-600">
        {t('No hay atajos registrados para esta herramienta todavía.')}
      </p>
    );
  }

  const handlePick = (desc: string) => {
    if (solved || wrong.has(desc)) return;
    const elapsed = performance.now() - shownAtRef.current;
    if (desc === currentShortcut.description) {
      setSolved(true);
      recordAttempt(true, elapsed);
      playCorrectSound();
      setTimeout(() => {
        // Reset junto con el avance (mismo render) para que la nueva
        // respuesta correcta no herede el verde por un frame.
        setSolved(false);
        setWrong(new Set());
        nextShortcut(tool);
      }, 350);
    } else {
      setWrong((prev) => new Set(prev).add(desc));
      recordAttempt(false, elapsed);
      playWrongSound();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <section className="w-full flex flex-col items-center gap-6 bg-slate-900/70 light:bg-white/80 p-6 sm:p-10 rounded-2xl border border-slate-800 light:border-slate-200 shadow-2xl backdrop-blur-sm">
          <p id="choice-q" className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {t('¿Qué hace este atajo?')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {currentShortcut.expectedCombo.map((key, i) => (
              <KeyCap key={`${key}-${i}`} char={formatKeyLabel(key)} variant={isDark ? 'dark' : 'light'} />
            ))}
          </div>
        </section>

        <div
          role="group"
          aria-labelledby="choice-q"
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {options.map((desc) => {
            const isCorrect = desc === currentShortcut.description;
            const showGreen = solved && isCorrect;
            const showRed = wrong.has(desc);
            return (
              <button
                key={`${currentShortcut.id}-${desc}`}
                type="button"
                onClick={() => handlePick(desc)}
                disabled={solved}
                className={cn(
                  'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors',
                  'bg-slate-900/60 light:bg-white border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-700',
                  'hover:border-sky-500 hover:text-sky-300 light:hover:text-sky-700',
                  showGreen && 'border-emerald-500 text-emerald-300 light:text-emerald-700 bg-emerald-500/10',
                  showRed && 'border-red-500 text-red-300 light:text-red-700 bg-red-500/10',
                )}
              >
                {showGreen && <Check className="inline w-4 h-4 mr-1.5 -mt-0.5" aria-hidden />}
                {showRed && <X className="inline w-4 h-4 mr-1.5 -mt-0.5" aria-hidden />}
                {t(desc)}
                {showGreen && <span className="sr-only"> — {t('correcto')}</span>}
                {showRed && <span className="sr-only"> — {t('incorrecto')}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <SessionStats tool={tool} totalShortcuts={filterByTool(shortcuts, tool).length} />
    </div>
  );
}
