import { ChevronDown } from "lucide-react";
import StickerTile from "./StickerTile";
import { matchesFilter, type Filter } from "./FilterBar";
import { STICKERS_PER_TEAM, stickerKey, type Team } from "./data/album";
import type { Counts } from "./useCollection";

type Props = {
  team: Team;
  counts: Counts;
  reserved: Record<string, number>;
  tradeItems?: Record<string, number>;
  tradeSide?: "give" | "receive";
  filter: Filter;
  subtractMode: boolean;
  bump: (code: string, delta: 1 | -1) => void;
};

export default function TeamSection({
  team,
  counts,
  reserved,
  tradeItems,
  tradeSide,
  filter,
  subtractMode,
  bump,
}: Props) {
  const keys = Array.from({ length: STICKERS_PER_TEAM }, (_, i) =>
    stickerKey(team.code, i + 1),
  );
  const owned = keys.filter((k) => (counts[k] ?? 0) >= 1).length;
  const visible = keys.filter((k) => matchesFilter(counts[k] ?? 0, filter));
  if (visible.length === 0) return null;

  return (
    <details open className="group rounded-xl border border-white/10 bg-[var(--color-surface)]/60">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold">
          {team.name} <span className="ml-1 text-xs font-normal text-white/40">{team.code}</span>
        </span>
        <span className="flex items-center gap-2 text-sm text-white/50">
          {owned}/{STICKERS_PER_TEAM}
          <ChevronDown size={16} className="transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="grid grid-cols-5 gap-2 px-4 pb-4">
        {visible.map((key) => (
          <StickerTile
            key={key}
            label={key.slice(team.code.length)}
            count={counts[key] ?? 0}
            reserved={reserved[key] ?? 0}
            tradeQty={tradeItems?.[key] ?? 0}
            tradeSide={tradeSide}
            subtractMode={subtractMode}
            onTap={() => bump(key, subtractMode ? -1 : 1)}
          />
        ))}
      </div>
    </details>
  );
}
