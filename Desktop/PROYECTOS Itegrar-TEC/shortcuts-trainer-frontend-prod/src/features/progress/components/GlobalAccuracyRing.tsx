import { useTranslation } from '@/features/translation/useTranslation';

interface GlobalAccuracyRingProps {
  value: number;
}

export function GlobalAccuracyRing({ value }: GlobalAccuracyRingProps) {
  const { t } = useTranslation();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={`${t('Precisión global')}: ${value}%`}
      className="relative w-52 h-52 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90"
        aria-hidden
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-800 light:text-slate-200"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-100 light:text-slate-900 tabular-nums">
          {value}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          global
        </span>
      </div>
    </div>
  );
}
