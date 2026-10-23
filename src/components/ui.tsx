import type { ReactNode } from "react";
import { cn, initials } from "@/lib/format";

export const TONES = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Avatar({
  name,
  color = "#6366f1",
  size = 32,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  return (
    <span
      title={name}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.36 }}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white"
    >
      {initials(name)}
    </span>
  );
}

export function Stat({
  label,
  value,
  delta,
  icon,
  tone = "indigo",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: string;
  tone?: Tone;
}) {
  const tint: Record<Tone, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    slate: "bg-slate-100 text-slate-500",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {delta ? <p className="mt-1 text-xs font-medium text-emerald-600">{delta}</p> : null}
        </div>
        {icon ? (
          <span className={cn("grid h-10 w-10 place-items-center rounded-xl text-lg", tint[tone])}>
            <span className="sr-only">{label}</span>
            <span aria-hidden>{icon}</span>
          </span>
        ) : null}
      </div>
    </Card>
  );
}

export function ProgressBar({
  value,
  tone = "indigo",
  className,
}: {
  value: number;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
  className?: string;
}) {
  const bg: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div className={cn("h-full rounded-full", bg[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-10 backdrop-blur-sm">
      <div className={cn("w-full rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5", width)}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint, icon = "📭" }: { title: string; hint?: string; icon?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
      <div className="text-3xl" aria-hidden>
        {icon}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">{title}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
