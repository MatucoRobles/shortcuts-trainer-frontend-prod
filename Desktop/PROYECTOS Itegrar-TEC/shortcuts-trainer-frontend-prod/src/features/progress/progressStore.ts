import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToolRecord {
  tool: string;
  bestStreakever: number;
  bestAvgResponseTime: number | null; // null = sin datos aún
  totalCorrect: number;
  totalWrong: number;
  masteredShortcutIds: string[];
}

interface ProgressState {
  records: Record<string, ToolRecord>; // key = tool name
  updateRecord: (
    tool: string,
    sessionData: {
      correct: number;
      wrong: number;
      streak: number;
      avgResponseTime: number;
      masteredIds: string[];
    },
  ) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      records: {},

      updateRecord: (tool, sessionData) =>
        set((state) => {
          const prev = state.records[tool];
          const updated: ToolRecord = {
            tool,
            bestStreakever: Math.max(
              prev?.bestStreakever ?? 0,
              sessionData.streak,
            ),
            bestAvgResponseTime: pickBestTime(
              prev?.bestAvgResponseTime ?? null,
              sessionData.avgResponseTime,
            ),
            totalCorrect: (prev?.totalCorrect ?? 0) + sessionData.correct,
            totalWrong: (prev?.totalWrong ?? 0) + sessionData.wrong,
            masteredShortcutIds: Array.from(
              new Set([
                ...(prev?.masteredShortcutIds ?? []),
                ...sessionData.masteredIds,
              ]),
            ),
          };
          return { records: { ...state.records, [tool]: updated } };
        }),

      resetProgress: () => set({ records: {} }),
    }),
    {
      name: "shortcuts-progress-storage",
      version: 1,
    },
  ),
);

// Lógica pura extraída del set() para facilitar testing
function pickBestTime(prev: number | null, current: number): number | null {
  if (current === 0) return prev;
  if (prev === null) return current;
  return Math.min(prev, current); // menor tiempo = mejor
}
