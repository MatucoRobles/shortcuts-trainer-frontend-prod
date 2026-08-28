import { Zap, X, Clock, Flame } from "lucide-react";
import { useShortcutStore } from "../useShortcutStore";
import { getAccuracy, getAverageResponseTime } from "../utils";
import { formatResponseTime } from "../../progress/utils";
import { cn } from "@/shared/utils/cn";
import { StatCard } from "./StatCard";
import { useTranslation } from "@/features/translation/useTranslation";

interface SessionStatsProps {
  tool: string;
  totalShortcuts: number;
}

/**
 * Panel de métricas en tiempo real durante una sesión de entrenamiento.
 * Lee directamente del store — no necesita props de datos, solo
 * `tool` para mostrar el contador X / total y `totalShortcuts`.
 *
 * D5: este componente es responsabilidad del Integrante 5.
 */
export function SessionStats(_props: SessionStatsProps) {
  const { t } = useTranslation();
  const correctAttempts = useShortcutStore((s) => s.correctAttempts);
  const wrongAttempts = useShortcutStore((s) => s.wrongAttempts);
  const currentStreak = useShortcutStore((s) => s.currentStreak);
  const responseTimes = useShortcutStore((s) => s.responseTimes);

  const accuracy = getAccuracy(correctAttempts, wrongAttempts);
  const avgTime = getAverageResponseTime(responseTimes);
  const hasStreak = currentStreak > 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {/* Cards: Aciertos / Errores / Tiempo */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t("Aciertos")}
          value={correctAttempts}
          icon={<Zap className="w-3.5 h-3.5" />}
          variant="correct"
        />
        <StatCard
          label={t("Errores")}
          value={wrongAttempts}
          icon={<X className="w-3.5 h-3.5" />}
          variant="wrong"
        />
        <StatCard
          label={t("Tiempo prom.")}
          value={formatResponseTime(avgTime === 0 ? null : avgTime)}
          icon={<Clock className="w-3.5 h-3.5" />}
          variant="neutral"
        />
      </div>

      {/* Barra de precisión */}
      <div className="bg-slate-800/60 light:bg-slate-200/60 rounded-xl border border-slate-700/50 light:border-slate-300/50 px-4 py-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            {t("Precisión")}
          </span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              accuracy === 100
                ? "text-emerald-400 light:text-emerald-600"
                : accuracy >= 70
                  ? "text-sky-400 light:text-sky-600"
                  : "text-red-400 light:text-red-600",
            )}
          >
            {accuracy}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-700 light:bg-slate-300 rounded-full overflow-hidden">
          <div
            role="progressbar"
            aria-label={t("Precisión")}
            aria-valuenow={accuracy}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
              "h-full rounded-full transition-all duration-500",
              accuracy === 100
                ? "bg-emerald-400"
                : accuracy >= 70
                  ? "bg-gradient-to-r from-sky-500 to-emerald-400"
                  : "bg-red-500",
            )}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* Racha actual */}
      <div className="bg-slate-800/60 light:bg-slate-200/60 rounded-xl border border-slate-700/50 light:border-slate-300/50 px-4 py-3 flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          {t("Racha actual")}
        </span>
        {hasStreak ? (
          <span className="flex items-center gap-1.5 text-orange-400 light:text-orange-600 font-semibold text-sm">
            <Flame className="w-4 h-4" aria-hidden />
            {currentStreak}
          </span>
        ) : (
          <span className="text-slate-600 light:text-slate-400 text-xs">{t("— sin racha")}</span>
        )}
      </div>
    </div>
  );
}
