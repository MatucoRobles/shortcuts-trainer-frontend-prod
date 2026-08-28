import { cn } from "@/shared/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  variant: "correct" | "wrong" | "neutral";
}

const styles = {
  correct: "border-emerald-500/30 light:border-emerald-500/50 text-emerald-400 light:text-emerald-600",
  wrong: "border-red-500/30 light:border-red-500/50 text-red-400 light:text-red-600",
  neutral: "border-slate-700/50 light:border-slate-300/50 text-sky-400 light:text-sky-600",
};

export function StatCard({ label, icon, value, variant }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-800/60 light:bg-slate-200/60 rounded-xl border px-4 py-3 flex flex-col gap-1.5",
        styles[variant],
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 text-[10px] uppercase tracking-widest",
          styles[variant],
        )}
      >
        {icon}
        {label}
      </span>
      <span className={cn("text-2xl font-bold tabular-nums", styles[variant])}>
        {value}
      </span>
    </div>
  );
}
