import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/shared/utils/cn';

type KeyCapVariant = 'light' | 'dark';

interface KeyCapProps {
  char: string;
  variant?: KeyCapVariant;
  /** Mientras es true, el borde se ilumina y emite el efecto vivo. */
  active?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<KeyCapVariant, string> = {
  light:
    'bg-gray-100 text-gray-800 border-gray-300 shadow-[0_4px_0_rgb(209,213,219)]',
  dark: 'bg-slate-800 text-slate-100 border-slate-600 shadow-[0_4px_0_rgb(15,23,42)]',
};

const ACTIVE_STYLES: Record<KeyCapVariant, string> = {
  light:
    'border-amber-400 shadow-[0_0_10px_2px_rgba(245,158,11,0.6),0_0_22px_6px_rgba(245,158,11,0.35)]',
  dark: 'border-amber-300 shadow-[0_0_12px_2px_rgba(252,211,77,0.8),0_0_28px_8px_rgba(252,211,77,0.45)]',
};

const HALO: Record<KeyCapVariant, string> = {
  dark: 'radial-gradient(circle, rgba(252,211,77,0.38) 0%, rgba(252,211,77,0) 68%)',
  light: 'radial-gradient(circle, rgba(245,158,11,0.42) 0%, rgba(245,158,11,0) 68%)',
};

// Burbujitas alrededor del keycap: tamaños, opacidades y velocidades
// distintas; las "soft" van difuminadas y al fondo para dar profundidad.
const BUBBLES = [
  { x: 30, y: -2, s: 4, o: 0.5, d: 2.6, delay: 0.0, dx: 6, soft: true },
  { x: 22, y: 22, s: 2.5, o: 0.85, d: 2.0, delay: 0.3, dx: -4, soft: false },
  { x: -4, y: 30, s: 3, o: 0.6, d: 2.8, delay: 0.6, dx: 5, soft: true },
  { x: -24, y: 20, s: 2, o: 0.9, d: 2.2, delay: 0.15, dx: -5, soft: false },
  { x: -32, y: -2, s: 4.5, o: 0.4, d: 3.0, delay: 0.5, dx: 4, soft: true },
  { x: -20, y: -22, s: 2.5, o: 0.8, d: 2.4, delay: 0.8, dx: -6, soft: false },
  { x: 2, y: -30, s: 3, o: 0.55, d: 2.7, delay: 0.2, dx: 5, soft: true },
  { x: 24, y: -20, s: 2, o: 0.9, d: 2.1, delay: 0.45, dx: -4, soft: false },
  { x: 14, y: 10, s: 1.5, o: 0.95, d: 1.8, delay: 0.0, dx: 3, soft: false },
  { x: -14, y: 8, s: 1.5, o: 0.9, d: 1.9, delay: 0.35, dx: -3, soft: false },
  { x: 10, y: -12, s: 2, o: 0.7, d: 2.3, delay: 0.6, dx: 4, soft: false },
  { x: -10, y: -10, s: 5, o: 0.3, d: 3.2, delay: 0.25, dx: -5, soft: true },
];

function KeyGlow({ variant }: { variant: KeyCapVariant }) {
  const dotBase = variant === 'dark' ? 'bg-amber-200' : 'bg-amber-500';

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Halo radial que respira (dos capas desfasadas). */}
      <motion.span
        className="absolute -inset-3 rounded-full"
        style={{ background: HALO[variant] }}
        animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute -inset-1.5 rounded-full"
        style={{ background: HALO[variant] }}
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Burbujitas flotando. */}
      <span className="absolute left-1/2 top-1/2">
        {BUBBLES.map((b, i) => (
          <motion.span
            key={i}
            className={cn('absolute rounded-full', dotBase, b.soft && 'blur-[1.5px]')}
            style={{ width: b.s, height: b.s, marginLeft: -b.s / 2, marginTop: -b.s / 2 }}
            animate={{
              x: [b.x, b.x + b.dx, b.x],
              y: [b.y, b.y - 8, b.y],
              opacity: [b.o * 0.25, b.o, b.o * 0.25],
              scale: [0.7, 1.12, 0.7],
            }}
            transition={{ duration: b.d, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </span>
    </motion.span>
  );
}

/**
 * Etiqueta visual de una tecla. Renderiza como `<kbd>` por accesibilidad.
 * Con `active`, muestra el efecto "vivo" continuo (borde brillante, halo
 * radial que respira y burbujitas flotando) mientras la tecla siga
 * presionada.
 */
export function KeyCap({ char, variant = 'light', active = false, className }: KeyCapProps) {
  const reduceMotion = useReducedMotion();
  return (
    <kbd
      className={cn(
        'relative min-w-[3rem] h-12 px-4 inline-flex items-center justify-center text-xl font-bold rounded-lg border uppercase transition-all duration-200',
        VARIANT_STYLES[variant],
        active && ACTIVE_STYLES[variant],
        active && 'scale-105',
        className,
      )}
    >
      <AnimatePresence>
        {active && !reduceMotion && <KeyGlow key="glow" variant={variant} />}
      </AnimatePresence>
      <span className="relative z-10">{char}</span>
    </kbd>
  );
}
