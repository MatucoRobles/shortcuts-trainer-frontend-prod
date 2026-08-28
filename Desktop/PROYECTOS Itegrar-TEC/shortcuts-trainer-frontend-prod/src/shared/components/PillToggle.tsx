import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface PillToggleProps {
  active: boolean;
  onClick: () => void;
  /** 'accent' = activo en sky (modos); 'neutral' = activo en gris (niveles). */
  variant?: 'accent' | 'neutral';
  children: ReactNode;
}

const ACTIVE: Record<'accent' | 'neutral', string> = {
  accent:
    'bg-sky-500/15 light:bg-sky-50 border border-sky-500 text-sky-400 light:text-sky-700 shadow-[0_0_12px_rgba(56,189,248,0.3)]',
  neutral:
    'bg-slate-700/80 light:bg-slate-200 border border-slate-500/70 light:border-slate-400 text-slate-100 light:text-slate-900',
};

const INACTIVE =
  'bg-transparent border border-slate-700/50 light:border-slate-300 text-slate-400 light:text-slate-500 hover:border-slate-500 light:hover:border-slate-400 hover:text-slate-200 light:hover:text-slate-700';

/**
 * Botón-píldora reutilizable para selectores (modos, niveles, etc.).
 * Centraliza estilo, `type="button"`, `aria-pressed` y el foco para no
 * repetir el patrón en cada selector.
 */
export function PillToggle({ active, onClick, variant = 'accent', children }: PillToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
        active ? ACTIVE[variant] : INACTIVE,
      )}
    >
      {children}
    </button>
  );
}
