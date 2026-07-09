import { ChevronDown } from "lucide-react";
import StickerTile from "./StickerTile";
import { matchesFilter, type Filter } from "./FilterBar";
import { displayCode } from "./data/album";
import type { Counts } from "./useCollection";

type Props = {
  title: string;
  codes: string[];
  counts: Counts;
  reserved: Record<string, number>;
  tradeItems?: Record<string, number>;
  tradeSide?: "give" | "receive";
  filter: Filter;
  subtractMode: boolean;
  bump: (code: string, delta: 1 | -1) => void;
};

/** Sección de estampas especiales (FIFA / Coca-Cola). */
export default function SpecialSection({
  title,
  codes,
  counts,
  reserved,
  tradeItems,
  tradeSide,
  filter,
  subtractMode,
  bump,
}: Props) {
  const owned = codes.filter((c) => (counts[c] ?? 0) >= 1).length;
  const visible = codes.filter((c) => matchesFilter(counts[c] ?? 0, filter));
  if (visible.length === 0) return null;

  return (
    <details open className="group rounded-xl border border-[var(--color-accent-2)]/20 bg-[var(--color-surface)]/60">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-[var(--color-accent-2)]">{title}</span>
        <span className="flex items-center gap-2 text-sm text-white/50">
          {owned}/{codes.length}
          <ChevronDown size={16} className="transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="grid grid-cols-4 gap-2 px-4 pb-4 sm:grid-cols-5">
        {visible.map((code) => (
          <StickerTile
            key={code}
            label={displayCode(code)}
            count={counts[code] ?? 0}
            reserved={reserved[code] ?? 0}
            tradeQty={tradeItems?.[code] ?? 0}
            tradeSide={tradeSide}
            subtractMode={subtractMode}
            onTap={() => bump(code, subtractMode ? -1 : 1)}
          />
        ))}
      </div>
    </details>
  );
}
