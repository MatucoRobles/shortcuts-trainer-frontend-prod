import { Link } from 'react-router';
import { Layers, ArrowRight, BarChart2, Eye } from 'lucide-react';
import { useShortcutStore } from '../useShortcutStore';
import { useTranslation } from '@/features/translation/useTranslation';
import { cn } from '@/shared/utils/cn';
import { TOOLS, type ToolDef } from '../tools';

interface ToolTileProps {
  card: ToolDef;
  count: number;
}

function ToolTile({ card, count }: ToolTileProps) {
  const { t } = useTranslation();
  const Icon = card.icon;
  return (
    <Link
      to={card.path}
      className="group flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/70 light:bg-white/80 border border-slate-800 light:border-slate-200 hover:border-sky-500/60 light:hover:border-sky-500 hover:bg-slate-900 light:hover:bg-white transition-colors"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 light:bg-slate-100 border border-slate-700 light:border-slate-200',
            card.accent,
          )}
        >
          <Icon className="w-5 h-5" aria-hidden />
        </span>
        <ArrowRight
          className="w-4 h-4 text-slate-600 light:text-slate-400 group-hover:text-sky-400 light:group-hover:text-sky-600 group-hover:translate-x-1 transition-transform"
          aria-hidden
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 light:text-slate-900">{t(card.title)}</h3>
        <p className="text-sm text-slate-400 light:text-slate-600 mt-1">{t(card.description)}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-slate-500">
          {count} {count === 1 ? t('atajo') : t('atajos')}
        </span>
        {card.visual && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 light:bg-amber-100 border border-amber-500/30 light:border-amber-500/50 text-amber-400 light:text-amber-700 text-[10px] uppercase tracking-widest">
            <Eye className="w-3 h-3" aria-hidden />
            Visual
          </span>
        )}
      </div>
    </Link>
  );
}

/**
 * Landing del entrenador. No contiene lógica de teclado:
 * su único rol es enrutar al usuario a la sesión de su herramienta.
 *
 * Lee los conteos desde el store para mostrar cuántos atajos hay
 * disponibles por herramienta. Esto se recalcula solo si la colección
 * de atajos cambia (selector granular de Zustand).
 */
export function TrainerHome() {
  const { t } = useTranslation();
  const shortcuts = useShortcutStore((s) => s.shortcuts);

  const counts = shortcuts.reduce<Record<string, number>>((acc, s) => {
    acc[s.tool] = (acc[s.tool] ?? 0) + 1;
    return acc;
  }, {});

  const total = shortcuts.length;

  return (
    <main className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col items-center justify-start px-6 pb-6 pt-2">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <header className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-sky-400 light:text-sky-600">
            <Layers className="w-3.5 h-3.5" aria-hidden />
            Shortcuts Trainer
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('Memoriza atajos, no menus')}
          </h1>
          <p className="text-slate-400 light:text-slate-600 text-base max-w-xl mx-auto">
            {t(
              'Practica combinaciones reales de tu editor, navegador y sistema operativo. Tu progreso se guarda automáticamente.',
            )}
          </p>
        </header>

        <section
          aria-label={t('Entrenamientos disponibles')}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {TOOLS.map((card) => (
            <ToolTile
              key={card.key}
              card={card}
              count={counts[card.key] ?? 0}
            />
          ))}
        </section>

        <footer className="flex flex-col items-center gap-4">
          <Link
            to="/progress"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 text-sm text-slate-300 light:text-slate-700 hover:border-sky-500 light:hover:border-sky-500 hover:text-sky-400 light:hover:text-sky-600 transition-colors"
          >
            <BarChart2 className="w-4 h-4" aria-hidden />
            {t('Ver mi progreso')}
          </Link>
          <p className="text-xs text-slate-500">
            {total} {t('atajos')} · {TOOLS.length} {t('herramientas')}
          </p>
        </footer>
      </div>
    </main>
  );
}
