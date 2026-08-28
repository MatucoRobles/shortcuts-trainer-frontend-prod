import { cn } from '@/shared/utils/cn';
import { getTool } from '../tools';

/**
 * Resplandor de acento por herramienta: un blob difuminado grande, fijo
 * (no se mueve al scrollear) y detrás de todo (`z-[-1]`). Se ve a través
 * de los `<main>` transparentes sobre el fondo base del `<html>`.
 */
export function ToolGlow({ tool }: { tool: string }) {
  const color = getTool(tool)?.glow;
  if (!color) return null;
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed left-1/2 top-[-14rem] -translate-x-1/2 z-[-1] h-[42rem] w-[120%] max-w-[1100px] rounded-full blur-[140px] opacity-30 light:opacity-45',
        color,
      )}
    />
  );
}
