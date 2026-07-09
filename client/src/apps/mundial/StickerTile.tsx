import { Lock } from "lucide-react";

type Props = {
  label: string;
  count: number;
  /** Copies promised in open trades ("apartadas"). */
  reserved?: number;
  /** Copies of this sticker in the ACTIVE trade side while in modo cambio. */
  tradeQty?: number;
  tradeSide?: "give" | "receive";
  subtractMode: boolean;
  onTap: () => void;
};

/**
 * One sticker. Gris = falta, morado = la tienes, cian = repetida (con "×n"),
 * ámbar = tiene copias apartadas en un cambio (candado con cuántas).
 * Min height keeps tap targets phone-friendly (~44px).
 */
export default function StickerTile({
  label,
  count,
  reserved = 0,
  tradeQty = 0,
  tradeSide,
  subtractMode,
  onTap,
}: Props) {
  const base =
    "relative flex min-h-11 select-none items-center justify-center rounded-lg text-sm font-medium transition active:scale-95";
  const look =
    reserved > 0
      ? "bg-amber-500/80 text-black"
      : count === 0
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
      {reserved > 0 && (
        <span className="absolute -left-1 -top-1 flex items-center gap-0.5 rounded-full bg-amber-300 px-1.5 text-[10px] font-bold text-black shadow">
          <Lock size={9} />
          ×{reserved}
        </span>
      )}
      {tradeQty > 0 && (
        <span
          className={`absolute -bottom-1 -right-1 rounded-full px-1.5 text-[10px] font-bold text-black shadow ${
            tradeSide === "receive" ? "bg-emerald-400" : "bg-amber-400"
          }`}
        >
          {tradeSide === "receive" ? "+" : "−"}
          {tradeQty}
        </span>
      )}
    </button>
  );
}
