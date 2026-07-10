import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]";

/** Selectable card used for class/race/background grids. */
export function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
          : "border-white/10 bg-[var(--color-bg)] hover:border-white/30"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{title}</span>
        {subtitle && <span className="shrink-0 text-xs text-white/40">{subtitle}</span>}
      </div>
      {children}
    </button>
  );
}

/** Toggleable chip used for skill and ability picks. */
export function PickChip({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled && !selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20 text-white"
          : disabled
            ? "cursor-not-allowed border-white/5 text-white/25"
            : "border-white/15 text-white/70 hover:border-white/40"
      }`}
    >
      {children}
    </button>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-4">
      {title && <h3 className="mb-3 text-sm font-semibold text-white/80">{title}</h3>}
      {children}
    </div>
  );
}

export function StatBox({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-bg)] p-3 text-center" title={hint}>
      <div className="text-lg font-bold">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}
