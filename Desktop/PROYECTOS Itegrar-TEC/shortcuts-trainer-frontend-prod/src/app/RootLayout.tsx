import { Outlet, useLocation } from 'react-router';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { LanguageToggle } from '@/features/translation/LanguageToggle';
import { useTranslation } from '@/features/translation/useTranslation';
import { TOOL_PATHS } from '@/features/training/tools';

// En las pantallas de training los toggles viven dentro del ToolHeader
// (al lado de "Progreso"), así que ahí no mostramos el top bar.
const TRAINING_PATHS = new Set(TOOL_PATHS);

export function RootLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const showBar = !TRAINING_PATHS.has(pathname);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-slate-950 focus:font-semibold"
      >
        {t('Saltar al contenido')}
      </a>

      {showBar && (
        <nav
          aria-label={t('Preferencias')}
          className="flex items-center justify-end gap-2 px-4 py-2 bg-transparent"
        >
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      )}

      <div id="contenido" tabIndex={-1} className="outline-none">
        <Outlet />
      </div>
    </>
  );
}
