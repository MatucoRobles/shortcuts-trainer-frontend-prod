import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shortcut } from './types';
import { INITIAL_SHORTCUTS } from './constants';
import { pickRandomShortcut } from './utils';

interface ShortcutState {
  shortcuts: Shortcut[];
  currentShortcut: Shortcut | null;

  // D4 nivel seleccionado para filtrar
  selectedLevel: number | null;

  // D3 — métricas
  correctAttempts: number;
  wrongAttempts: number;
  currentStreak: number;
  responseTimes: number[];

  setCurrentShortcut: (shortcut: Shortcut | null) => void;
  nextShortcut: (tool?: string) => void;

  // D4 acción para cambiar el nivel
  setSelectedLevel: (level: number | null) => void;

  // D3 — acciones
  recordAttempt: (isCorrect: boolean, responseTimeMs: number) => void;
  resetStats: () => void;
}

/**
 * Store global de entrenamiento.
 *
 * Decisiones arquitectónicas:
 * - Persistencia en `localStorage` delegada al middleware `persist`
 *   (regla 3 de AGENT.md: prohibido `localStorage.setItem` esparcido).
 * - Las acciones de dominio (rotación, filtrado) se exponen aquí solo
 *   cuando son transversales; el filtrado fino por herramienta
 *   se hace desde la feature con utilidades puras.
 * - Las métricas (D3) viven en el store porque deben persistir y son
 *   transversales a todas las pantallas de entrenamiento.
 */
export const useShortcutStore = create<ShortcutState>()(
  persist(
    (set, get) => ({
      shortcuts: INITIAL_SHORTCUTS,
      // El cast a `Shortcut | null` evita que TS infiera solo `Shortcut`
      // (el indexado [0] se asume no-undefined sin noUncheckedIndexedAccess).
      currentShortcut: (INITIAL_SHORTCUTS[0] ?? null) as Shortcut | null,

      selectedLevel: null,
      correctAttempts: 0,
      wrongAttempts: 0,
      currentStreak: 0,
      responseTimes: [],

      setCurrentShortcut: (shortcut) => set({ currentShortcut: shortcut }),

      // D4
      setSelectedLevel: (level) => set({ selectedLevel: level }),

      nextShortcut: (tool) => {
        const { shortcuts, currentShortcut, selectedLevel } = get();
        let pool = shortcuts;
        if (tool) pool = pool.filter(s => s.tool === tool);
        if (selectedLevel !== null) pool = pool.filter(s => s.level === selectedLevel);
        const next = pickRandomShortcut(pool, currentShortcut?.id ?? null);
        set({ currentShortcut: next });
      },

      recordAttempt: (isCorrect, responseTimeMs) =>
        set((state) => ({
          correctAttempts: isCorrect
            ? state.correctAttempts + 1
            : state.correctAttempts,
          wrongAttempts: isCorrect
            ? state.wrongAttempts
            : state.wrongAttempts + 1,
          currentStreak: isCorrect ? state.currentStreak + 1 : 0,
          responseTimes: [...state.responseTimes, responseTimeMs],
        })),

      resetStats: () =>
        set({
          correctAttempts: 0,
          wrongAttempts: 0,
          currentStreak: 0,
          responseTimes: [],
        }),
    }),
    {
      name: 'shortcuts-trainer-storage',
      version: 3,
      // El catálogo de atajos es data de la app (viene del código), no del
      // usuario: no se persiste para que no quede desactualizado al sumar
      // tools/atajos. Solo recordamos el filtro de nivel elegido.
      partialize: (state) => ({ selectedLevel: state.selectedLevel }),
    },
  ),
);
