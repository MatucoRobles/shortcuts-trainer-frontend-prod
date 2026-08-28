import type { ToolRecord } from "./progressStore";
import { getAccuracy } from "../training/utils";

export interface GlobalStats {
  globalAccuracy: number;
  totalMastered: number;
  totalShortcuts: number;
}

/**
 * Calcula la precisión global sumando todos los aciertos y errores
 * de todas las herramientas. Función pura — no toca store.
 */
export function getGlobalStats(
  records: Record<string, ToolRecord>,
  totalShortcuts: number,
): GlobalStats {
  const values = Object.values(records);
  const totalCorrect = values.reduce((acc, r) => acc + r.totalCorrect, 0);
  const totalWrong = values.reduce((acc, r) => acc + r.totalWrong, 0);

  const allMastered = values.flatMap((r) => r.masteredShortcutIds);
  const uniqueMastered = new Set(allMastered).size;

  return {
    globalAccuracy: getAccuracy(totalCorrect, totalWrong),
    totalMastered: uniqueMastered,
    totalShortcuts,
  };
}

/**
 * Un atajo se considera "dominado" si el usuario lo acertó al menos
 * una vez con racha >= 2 en alguna sesión. En esta versión simplificada
 * se registra el id cuando se acertó consecutivamente (D3 lo provee).
 */
export function isMastered(
  shortcutId: string,
  records: Record<string, ToolRecord>,
): boolean {
  return Object.values(records).some((r) =>
    r.masteredShortcutIds.includes(shortcutId),
  );
}

export function formatResponseTime(ms: number | null): string {
  if (ms === null) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}
