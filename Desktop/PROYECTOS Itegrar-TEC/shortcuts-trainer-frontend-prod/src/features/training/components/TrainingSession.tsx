import { ToolHeader } from './ToolHeader';
import { FilterBar } from './FilterBar';
import { ModeSelector } from './ModeSelector';
import { ToolGlow } from './ToolGlow';
import { PracticeBoard } from './PracticeBoard';
import { ChoiceBoard } from './ChoiceBoard';
import { TimeAttackBoard } from './TimeAttackBoard';
import { useModeStore } from '../modeStore';

interface TrainingSessionProps {
  tool: string;
  description?: string;
}

/**
 * Shell de la sesión de entrenamiento: header, filtros y selector de
 * modo, y despacha al tablero del modo activo (Aprender / Adivinar /
 * Opción múltiple / Contrarreloj).
 */
export function TrainingSession({ tool, description }: TrainingSessionProps) {
  const mode = useModeStore((s) => s.mode);

  return (
    <main className="min-h-screen w-full bg-transparent text-slate-100 light:text-slate-900 flex flex-col items-center p-6 gap-8">
      <ToolGlow tool={tool} />
      <ToolHeader tool={tool} description={description} />
      <FilterBar activeCategory={tool} />
      <ModeSelector />

      {mode === 'learn' && <PracticeBoard key="learn" tool={tool} reveal />}
      {mode === 'guess' && <PracticeBoard key="guess" tool={tool} reveal={false} />}
      {mode === 'choice' && <ChoiceBoard key="choice" tool={tool} />}
      {mode === 'timeattack' && <TimeAttackBoard key="timeattack" tool={tool} />}
    </main>
  );
}
