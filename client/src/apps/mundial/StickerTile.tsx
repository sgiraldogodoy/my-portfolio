type Props = {
  label: string;
  count: number;
  subtractMode: boolean;
  onTap: () => void;
};

/**
 * One sticker. Gris = falta, morado = la tienes, cian = repetida (con "×n").
 * Min height keeps tap targets phone-friendly (~44px).
 */
export default function StickerTile({ label, count, subtractMode, onTap }: Props) {
  const base =
    "relative flex min-h-11 select-none items-center justify-center rounded-lg text-sm font-medium transition active:scale-95";
  const look =
    count === 0
      ? "bg-white/5 text-white/35 hover:bg-white/10"
      : count === 1
        ? "bg-[var(--color-accent)]/80 text-white"
        : "bg-[var(--color-accent-2)]/80 text-black";

  return (
    <button
      type="button"
      onClick={onTap}
      className={`${base} ${look} ${subtractMode && count > 0 ? "ring-2 ring-red-400/70" : ""}`}
    >
      {label}
      {count > 1 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-[var(--color-accent-2)] px-1.5 text-[10px] font-bold text-black shadow">
          ×{count}
        </span>
      )}
    </button>
  );
}
