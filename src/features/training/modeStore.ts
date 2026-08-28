import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TrainingMode = 'learn' | 'guess' | 'choice' | 'timeattack';

interface ModeState {
  mode: TrainingMode;
  setMode: (mode: TrainingMode) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: 'learn',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'shortcuts-trainer-mode-storage', version: 1 },
  ),
);
