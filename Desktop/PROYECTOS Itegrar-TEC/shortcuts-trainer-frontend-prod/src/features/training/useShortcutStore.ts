import { create } from 'zustand';
    3 import { persist } from 'zustand/middleware';
    4 import type { Shortcut } from './types';
    5 import { pickRandomShortcut } from './utils';
    6
    7 interface ShortcutState {
    8   shortcuts: Shortcut[];
    9   currentShortcut: Shortcut | null;
   10   selectedLevel: number | null;
   11   correctAttempts: number;
   12   wrongAttempts: number;
   13   currentStreak: number;
   14   responseTimes: number[];
   15
   16   // Nueva acción para cargar datos
   17   fetchShortcuts: () => Promise<void>;
   18   
   19   setCurrentShortcut: (shortcut: Shortcut | null) => void;
   20   nextShortcut: (tool?: string) => void;
   21   setSelectedLevel: (level: number | null) => void;
   22   recordAttempt: (isCorrect: boolean, responseTimeMs: number) => void;
   23   resetStats: () => void;
   24 }
   25
   26 export const useShortcutStore = create<ShortcutState>()(
   27   persist(
   28     (set, get) => ({
   29       shortcuts: [], // Inicia vacío
   30       currentShortcut: null,
   31       selectedLevel: null,
   32       correctAttempts: 0,
   33       wrongAttempts: 0,
   34       currentStreak: 0,
   35       responseTimes: [],
   36
   37       // Implementación de carga desde API
   38       fetchShortcuts: async () => {
   39         try {
   40           const res = await fetch(`${import.meta.env.VITE_API_URL}/shortcuts`);
   41           const data = await res.json();
   42           set({ shortcuts: data, currentShortcut: data[0] || null });
   43         } catch (err) {
   44           console.error("Error conectando con la API:", err);
   45         }
   46       },
   47
   48       setCurrentShortcut: (shortcut) => set({ currentShortcut: shortcut }),
   49       setSelectedLevel: (level) => set({ selectedLevel: level }),
   50
   51       nextShortcut: (tool) => {
   52         const { shortcuts, currentShortcut, selectedLevel } = get();
   53         let pool = shortcuts;
   54         if (tool) pool = pool.filter(s => s.tool === tool);
   55         if (selectedLevel !== null) pool = pool.filter(s => s.level === selectedLevel);
   56         const next = pickRandomShortcut(pool, currentShortcut?.id ?? null);
   57         set({ currentShortcut: next });
   58       },
   59
   60       recordAttempt: (isCorrect, responseTimeMs) =>
   61         set((state) => ({
   62           correctAttempts: isCorrect ? state.correctAttempts + 1 : state.correctAttempts,
   63           wrongAttempts: isCorrect ? state.wrongAttempts : state.wrongAttempts + 1,
   64           currentStreak: isCorrect ? state.currentStreak + 1 : 0,
   65           responseTimes: [...state.responseTimes, responseTimeMs],
   66         })),
   67
   68       resetStats: () =>
   69         set({ correctAttempts: 0, wrongAttempts: 0, currentStreak: 0, responseTimes: [] }),
   70     }),
   71     {
   72       name: 'shortcuts-trainer-storage',
   73       version: 3,
   74       partialize: (state) => ({ selectedLevel: state.selectedLevel }),
   75     },
   76   ),
   77 );