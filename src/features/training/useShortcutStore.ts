import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shortcut } from './types';
import { pickRandomShortcut } from './utils';

interface ShortcutState {
  shortcuts: Shortcut[];
  currentShortcut: Shortcut | null;
  selectedLevel: number | null;
  correctAttempts: number;
  wrongAttempts: number;
  currentStreak: number;
  responseTimes: number[];

  // Nueva acción para cargar datos
  fetchShortcuts: () => Promise<void>;
  
  setCurrentShortcut: (shortcut: Shortcut | null) => void;
  nextShortcut: (tool?: string) => void;
  setSelectedLevel: (level: number | null) => void;
  recordAttempt: (isCorrect: boolean, responseTimeMs: number) => void;
  resetStats: () => void;
}

export const useShortcutStore = create<ShortcutState>()(
  persist(
    (set, get) => {
      return {
        shortcuts: [],
        currentShortcut: null,
        selectedLevel: null,
        correctAttempts: 0,
        wrongAttempts: 0,
        currentStreak: 0,
        responseTimes: [],

        fetchShortcuts: async () => {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/shortcuts`);
            const data = await res.json();
            set({ shortcuts: data, currentShortcut: data[0] || null });
          } catch (err) {
            console.error("Error conectando con la API:", err);
          }
        },

        setCurrentShortcut: (shortcut) => set({ currentShortcut: shortcut }),
        setSelectedLevel: (level) => set({ selectedLevel: level }),

        nextShortcut: (tool) => {
          const { shortcuts, currentShortcut, selectedLevel } = get();
          let pool = shortcuts;
          if (tool) pool = pool.filter((s) => s.tool === tool);
          if (selectedLevel !== null) pool = pool.filter((s) => s.level === selectedLevel);
          const next = pickRandomShortcut(pool, currentShortcut?.id ?? null);
          set({ currentShortcut: next });
        },

        recordAttempt: (isCorrect, responseTimeMs) => {
          set((state) => ({
            correctAttempts: isCorrect ? state.correctAttempts + 1 : state.correctAttempts,
            wrongAttempts: isCorrect ? state.wrongAttempts : state.wrongAttempts + 1,
            currentStreak: isCorrect ? state.currentStreak + 1 : 0,
            responseTimes: [...state.responseTimes, responseTimeMs],
          }));
        },

        resetStats: () =>
          set({ correctAttempts: 0, wrongAttempts: 0, currentStreak: 0, responseTimes: [] }),
      };
    },
    {
      name: 'shortcuts-trainer-storage',
      version: 3,
      partialize: (state) => ({ selectedLevel: state.selectedLevel }),
    }
  )
);
