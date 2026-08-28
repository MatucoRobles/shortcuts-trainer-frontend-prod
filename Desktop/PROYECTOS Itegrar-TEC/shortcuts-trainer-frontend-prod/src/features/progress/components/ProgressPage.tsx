import { ArrowLeft, Trophy, Clock, Flame } from "lucide-react";
import { useNavigate } from "react-router";
import { useProgressStore } from "../progressStore";
import { useShortcutStore } from "../../training/useShortcutStore";
import { getGlobalStats, formatResponseTime, isMastered } from "../utils";
import { getAccuracy } from "../../training/utils";
import { cn } from "@/shared/utils/cn";
import { GlobalAccuracyRing } from "./GlobalAccuracyRing";
import { useTranslation } from "@/features/translation/useTranslation";
import { getTool } from "../../training/tools";

// Herramientas visuales (no se practican con teclado) → fuera del progreso.
const VISUAL_ONLY_TOOLS = new Set(["Windows"]);

export function ProgressPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const records = useProgressStore((s) => s.records);
  const shortcuts = useShortcutStore((s) => s.shortcuts);

  // Solo atajos practicables (excluye los visuales como Windows).
  const practicable = shortcuts.filter((s) => !VISUAL_ONLY_TOOLS.has(s.tool));

  // Récords sin las herramientas visuales: no inflan la precisión global.
  const practicedRecords = Object.fromEntries(
    Object.entries(records).filter(([tool]) => !VISUAL_ONLY_TOOLS.has(tool)),
  );

  const { globalAccuracy, totalMastered, totalShortcuts } = getGlobalStats(
    practicedRecords,
    practicable.length,
  );

  const toolRows = Object.values(practicedRecords);

  return (
    <main className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 p-6 flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="hidden sm:flex items-center gap-1.5 text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Atrás')}
        </button>
        <Trophy className="w-5 h-5 text-yellow-400 light:text-yellow-600" aria-hidden />
        <h1 className="text-lg font-semibold">{t('Tu Progreso')}</h1>
      </header>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Tabla de récords por herramienta */}
        <section className="lg:w-2/3 bg-slate-900/70 light:bg-white/80 rounded-2xl border border-slate-800 light:border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 light:border-slate-200">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              {t('Récords por herramienta')}
            </p>
          </div>

          {toolRows.length === 0 ? (
            <p className="px-5 py-8 text-slate-500 text-sm text-center">
              {t('Completá al menos una sesión para ver tus récords.')}
            </p>
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">{t('Récords por herramienta')}</caption>
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800 light:border-slate-200">
                  <th scope="col" className="text-left px-4 py-2">{t('Herramienta')}</th>
                  <th scope="col" className="text-left px-3 py-2">{t('Mejor T.')}</th>
                  <th scope="col" className="text-left px-3 py-2">{t('Racha')}</th>
                  <th scope="col" className="text-left px-3 py-2 hidden sm:table-cell">
                    {t('Precisión')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {toolRows.map((record) => {
                  const accuracy = getAccuracy(
                    record.totalCorrect,
                    record.totalWrong,
                  );
                  return (
                    <tr
                      key={record.tool}
                      className="border-b border-slate-800/50 light:border-slate-200 last:border-0 hover:bg-slate-800/30 light:hover:bg-slate-100 transition-colors"
                    >
                      <td
                        className={cn(
                          "px-4 py-4 font-medium",
                          getTool(record.tool)?.accent ?? "text-slate-300 light:text-slate-700",
                        )}
                      >
                        {record.tool}
                      </td>
                      <td className="px-3 py-4 text-slate-400 light:text-slate-600 tabular-nums">
                        <span className="flex items-center gap-1.5">
                          <Clock
                            className="w-3.5 h-3.5 text-sky-500"
                            aria-hidden
                          />
                          {formatResponseTime(record.bestAvgResponseTime)}
                        </span>
                      </td>
                      <td className="px-3 py-4 tabular-nums">
                        <span className="flex items-center gap-1.5 text-orange-400 light:text-orange-600">
                          <Flame className="w-3.5 h-3.5" aria-hidden />
                          {record.bestStreakever}
                        </span>
                      </td>
                      {/* Oculta en mobile, visible desde sm */}
                      <td className="px-3 py-4 w-36 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700 light:bg-slate-300 rounded-full overflow-hidden">
                            <div
                              role="progressbar"
                              aria-label={`${t('Precisión')}: ${record.tool}`}
                              aria-valuenow={accuracy}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                getTool(record.tool)?.bar ?? "bg-slate-400",
                              )}
                              style={{ width: `${accuracy}%` }}
                            />
                          </div>
                          <span className="text-slate-400 light:text-slate-600 tabular-nums text-xs w-8 text-right">
                            {accuracy}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {/* Círculo global */}
        <section className="lg:w-1/3 bg-slate-900/70 light:bg-white/80 rounded-2xl border border-slate-800 light:border-slate-200 flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            {t('Precisión global')}
          </p>
          <GlobalAccuracyRing value={globalAccuracy} />
        </section>
      </div>

      {/* Atajos dominados */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            {t('Atajos dominados')}
          </p>
          <span className="text-sm text-emerald-400 light:text-emerald-600 font-semibold tabular-nums">
            {totalMastered} / {totalShortcuts}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {practicable.map((shortcut) => {
            const mastered = isMastered(shortcut.id, records);
            return (
              <span
                key={shortcut.id}
                title={t(shortcut.description)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors",
                  mastered
                    ? "bg-emerald-500/10 light:bg-emerald-100 border-emerald-500/40 light:border-emerald-500/60 text-emerald-400 light:text-emerald-700"
                    : "bg-slate-800/60 light:bg-slate-100 border-slate-700/50 light:border-slate-300 text-slate-600 light:text-slate-500",
                )}
              >
                {shortcut.expectedCombo
                  .map((k) => (k === "Control" ? "Ctrl" : k))
                  .join("+")}
              </span>
            );
          })}
        </div>
      </section>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex sm:hidden items-center gap-1.5 text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 text-lg m-auto transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('Atrás')}
      </button>
    </main>
  );
}

