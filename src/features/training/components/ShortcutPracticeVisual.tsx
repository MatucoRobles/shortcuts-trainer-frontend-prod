import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { ShortcutCard } from './ShortcutCard';
import type { Shortcut } from '../types';
import { useTranslation } from '@/features/translation/useTranslation';

interface ShortcutPracticeVisualProps {
  shortcuts: Shortcut[];
  description?: string;
}

/**
 * Práctica visual para atajos que no se pueden capturar (los intercepta
 * el SO, como los de la tecla `Win`). No escucha teclas reales: navega
 * con botones o con las flechas ← →.
 *
 * Es solo contenido — el shell de la página (header, filtros, fondo) lo
 * provee `WindowsTraining`, igual que el resto de las herramientas.
 */
export function ShortcutPracticeVisual({
  shortcuts,
  description,
}: ShortcutPracticeVisualProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = shortcuts.length;

  useEffect(() => {
    if (total === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % total);
      else if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  if (total === 0) {
    return (
      <p className="text-slate-400 light:text-slate-600">
        {t('No hay atajos para mostrar.')}
      </p>
    );
  }

  const index = currentIndex % total;
  const shortcut = shortcuts[index];

  const handleNext = () => setCurrentIndex((p) => (p + 1) % total);
  const handlePrev = () => setCurrentIndex((p) => (p - 1 + total) % total);

  return (
    <section className="w-full flex flex-col items-center gap-8">
      {description && (
        <p className="text-slate-400 light:text-slate-600 text-base text-center max-w-xl">
          {t(description)}
        </p>
      )}

      <div role="note" className="flex items-start gap-3 bg-amber-900/20 light:bg-amber-50 border border-amber-600/40 light:border-amber-500/40 rounded-xl px-5 py-4 max-w-xl">
        <AlertTriangle className="w-5 h-5 text-amber-400 light:text-amber-600 shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-amber-200 light:text-amber-900 leading-relaxed">
          <p className="font-semibold">{t('⚠️ Estos atajos son peligrosos')}</p>
          <p className="mt-1">
            {t(
              'Al presionarlos se ejecutan en tu PC (por ejemplo, Win+L bloquea la computadora). Usá los botones para navegar y aprender las combinaciones visualmente.',
            )}
          </p>
        </div>
      </div>

      <ShortcutCard shortcut={shortcut} />

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-700 text-sm font-medium hover:bg-slate-700 light:hover:bg-slate-100 hover:border-slate-600 light:hover:border-slate-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
          {t('Anterior')}
        </button>

        <span aria-live="polite" className="text-slate-400 light:text-slate-600 text-sm tabular-nums">
          {index + 1} / {total}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-700 text-sm font-medium hover:bg-slate-700 light:hover:bg-slate-100 hover:border-slate-600 light:hover:border-slate-400 transition-colors"
        >
          {t('Siguiente')}
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>

      <p className="text-xs text-slate-600 light:text-slate-500">
        {t('Podés usar las teclas ← → para navegar')}
      </p>
    </section>
  );
}
