import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
}

const STORAGE_KEY = 'shortcuts-trainer-theme-storage';

/**
 * Store global del tema. Default en `'dark'` para mantener el aspecto
 * actual del proyecto; la preferencia del usuario se persiste en
 * `localStorage` y se aplica como clase `.light` en `<html>` cuando
 * el modo es claro. Sin clase, la app se ve en dark (convención: dark
 * como base, light como override; ver `index.css`).
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggle: () => {
        const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
        const apply = () => {
          document.documentElement.classList.toggle('light', next === 'light');
          set({ mode: next });
        };
        const doc = document as Document & {
          startViewTransition?: (cb: () => void) => unknown;
        };
        if (typeof doc.startViewTransition === 'function') {
          doc.startViewTransition(apply);
        } else {
          apply();
        }
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
    },
  ),
);
