import { Languages } from 'lucide-react';
import { useLanguageStore } from './useLanguageStore';

export function LanguageToggle() {
  const language = useLanguageStore((s) => s.language);
  const toggle = useLanguageStore((s) => s.toggle);
  const isEs = language === 'es';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isEs ? 'Cambiar idioma a inglés (EN)' : 'Switch language to Spanish (ES)'}
      title={isEs ? 'English' : 'Español'}
      className="inline-flex items-center justify-center gap-1 h-10 px-3 rounded-full bg-slate-800/80 light:bg-white/80 border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-700 hover:bg-slate-700 light:hover:bg-slate-100 transition-colors backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)] light:shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-xs font-semibold"
    >
      <Languages className="w-4 h-4" aria-hidden />
      {isEs ? 'EN' : 'ES'}
    </button>
  );
}
