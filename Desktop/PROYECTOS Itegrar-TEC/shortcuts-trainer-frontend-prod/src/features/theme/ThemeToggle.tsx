import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from './useThemeStore';
import { useTranslation } from '@/features/translation/useTranslation';

/**
 * Botón flotante con 2 estados (light / dark). El ícono indica la
 * acción al hacer click: en dark muestra Sun (porque iría a light),
 * y viceversa.
 *
 * Se adapta al tema actual: en dark mode se ve como un botón oscuro
 * glassmorphic; en light mode se ve como un botón claro con sombra
 * sutil. El contraste se mantiene en ambos casos.
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === 'dark';
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={
        isDark
          ? t('Tema actual: oscuro. Click para cambiar.')
          : t('Tema actual: claro. Click para cambiar.')
      }
      title={isDark ? t('Modo oscuro') : t('Modo claro')}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 light:bg-white/80 border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-700 hover:bg-slate-700 light:hover:bg-slate-100 transition-colors backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)] light:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="inline-flex"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
