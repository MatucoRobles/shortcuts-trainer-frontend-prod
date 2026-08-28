import { Link } from 'react-router';
import { Home as HomeIcon } from 'lucide-react';
import { useTranslation } from '@/features/translation/useTranslation';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-7xl font-extrabold text-slate-700 light:text-slate-300">404</p>
      <h1 className="text-2xl font-semibold">{t('Página no encontrada')}</h1>
      <p className="text-slate-400 light:text-slate-600 max-w-md">
        {t(
          'La ruta que buscás no existe. Vuelve al inicio y elegí una herramienta para seguir entrenando.',
        )}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 transition-colors"
      >
        <HomeIcon className="w-4 h-4" aria-hidden />
        {t('Ir al inicio')}
      </Link>
    </main>
  );
}
