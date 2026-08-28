import { useState, useCallback } from "react";

export type FeedbackStatus = "idle" | "correct" | "wrong";

interface UseFeedbackReturn {
  status: FeedbackStatus;
  triggerCorrect: () => void;
  triggerWrong: () => void;
}

const FEEDBACK_DURATION_MS = 600;

/**
 * Maneja el estado de feedback visual (verde/rojo) con auto-reset.
 *
 * - Dura 600ms y vuelve a 'idle' automáticamente
 * - `useCallback` evita recrear las funciones en cada render
 * - El timeout se limpia si se dispara otro feedback antes de que expire
 */
export function useFeedback(): UseFeedbackReturn {
  const [status, setStatus] = useState<FeedbackStatus>("idle");

  const trigger = useCallback((next: FeedbackStatus) => {
    setStatus(next);
    const id = setTimeout(() => setStatus("idle"), FEEDBACK_DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  const triggerCorrect = useCallback(() => trigger("correct"), [trigger]);
  const triggerWrong = useCallback(() => trigger("wrong"), [trigger]);

  return { status, triggerCorrect, triggerWrong };
}
