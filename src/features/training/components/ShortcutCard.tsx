import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyCap } from '@/shared/components/KeyCap';
import type { Shortcut } from '../types';
import { useThemeStore } from '@/features/theme/useThemeStore';
import { useTranslation } from '@/features/translation/useTranslation';
import { canonicalKey, formatKeyLabel } from '../utils';
import { playKeycapSound } from '@/shared/utils/sound';

interface ShortcutCardProps {
  shortcut: Shortcut;
  /** Si es false, oculta las teclas (modo Adivinar). */
  reveal?: boolean;
}

/**
 * Tarjeta central que muestra la descripción del atajo y su combinación.
 *
 * Escucha `keydown`/`keyup` para iluminar en vivo los keycaps mientras
 * la tecla siga presionada (efecto "teclado vivo") y reproduce el sonido
 * de chispa elegido en cada pulsación nueva.
 */
export function ShortcutCard({ shortcut, reveal = true }: ShortcutCardProps) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.mode === 'dark');

  const expectedNorm = useMemo(
    () => shortcut.expectedCombo.map(canonicalKey),
    [shortcut],
  );

  const [activeIdx, setActiveIdx] = useState<ReadonlySet<number>>(new Set());
  const downKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    downKeys.current.clear();
    setActiveIdx(new Set());

    const recompute = () => {
      const next = new Set<number>();
      expectedNorm.forEach((k, i) => {
        if (downKeys.current.has(k)) next.add(i);
      });
      setActiveIdx(next);
    };

    const syncMods = (event: KeyboardEvent) => {
      const flags: Array<[string, boolean]> = [
        ['Control', event.ctrlKey],
        ['Shift', event.shiftKey],
        ['Alt', event.altKey],
        ['Meta', event.metaKey],
      ];
      flags.forEach(([name, on]) => {
        if (on) downKeys.current.add(name);
        else downKeys.current.delete(name);
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      syncMods(event);
      const k = canonicalKey(event.key);
      downKeys.current.add(k);
      recompute();
      if (!event.repeat && expectedNorm.includes(k)) playKeycapSound();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      syncMods(event);
      downKeys.current.delete(canonicalKey(event.key));
      recompute();
    };

    const reset = () => {
      downKeys.current.clear();
      setActiveIdx(new Set());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', reset);
    };
  }, [expectedNorm]);

  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 bg-slate-900/70 light:bg-white/80 p-6 sm:p-10 rounded-2xl border border-slate-800 light:border-slate-200 shadow-2xl backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        {t('Atajo a ejecutar')}
      </p>

      <h2
        aria-live="polite"
        className="text-2xl md:text-3xl font-semibold text-slate-100 light:text-slate-900 text-center"
      >
        {t(shortcut.description)}
      </h2>

      <div
        className="flex flex-wrap items-center justify-center gap-3"
        aria-label={
          reveal
            ? `${t('Combinación')}: ${shortcut.expectedCombo.map(formatKeyLabel).join(' + ')}`
            : t('Combinación oculta')
        }
      >
        {shortcut.expectedCombo.map((key, index) => (
          <KeyCap
            key={`${key}-${index}`}
            char={reveal ? formatKeyLabel(key) : '?'}
            variant={isDark ? 'dark' : 'light'}
            active={reveal && activeIdx.has(index)}
          />
        ))}
      </div>
    </section>
  );
}
