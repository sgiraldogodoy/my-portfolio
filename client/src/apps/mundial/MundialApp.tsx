import { useMemo, useState } from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import QuickEntry from "./QuickEntry";
import FilterBar, { matchesFilter, type Filter } from "./FilterBar";
import TeamSection from "./TeamSection";
import SpecialSection from "./SpecialSection";
import TradesPanel from "./TradesPanel";
import { useCollection } from "./useCollection";
import { useTrades } from "./useTrades";
import { exportToExcel } from "./exportExcel";
import {
  COCA_CODES,
  GROUPS,
  SPECIAL_CODES,
  STICKERS_PER_TEAM,
  stickerKey,
  TEAMS,
  TOTAL_STICKERS,
} from "./data/album";

export default function MundialApp() {
  const { counts, loading, error, bump, replace } = useCollection();
  const trades = useTrades(replace);
  const [view, setView] = useState<"album" | "cambios">("album");
  const [filter, setFilter] = useState<Filter>("todas");
  const [group, setGroup] = useState("todos");
  const [teamCode, setTeamCode] = useState("todos");
  const [subtractMode, setSubtractMode] = useState(false);

  // Copies promised across all open trades, per sticker code ("apartadas").
  const reserved = useMemo(() => {
    const map: Record<string, number> = {};
    for (const trade of trades.trades) {
      if (trade.status !== "abierto") continue;
      for (const [code, qty] of Object.entries(trade.give)) {
        map[code] = (map[code] ?? 0) + qty;
      }
    }
    return map;
  }, [trades.trades]);

  const openTrades = trades.trades.filter((t) => t.status === "abierto").length;

  function handleGroup(g: string) {
    setGroup(g);
    // Drop the team selection when it no longer belongs to the chosen group.
    if (g !== "todos") {
      const team = TEAMS.find((t) => t.code === teamCode);
      if (team && team.group !== g) setTeamCode("todos");
    }
  }

  function handleTeam(code: string) {
    setTeamCode(code);
    // Selecting a team jumps the group along with it, so the header shows too.
    if (code !== "todos") {
      const team = TEAMS.find((t) => t.code === code);
      if (team && group !== "todos" && team.group !== group) setGroup(team.group);
    }
  }

  const stats = useMemo(() => {
    let owned = 0;
    let repeats = 0;
    for (const count of Object.values(counts)) {
      if (count >= 1) owned += 1;
      if (count > 1) repeats += count - 1;
    }
    return { owned, repeats, missing: TOTAL_STICKERS - owned };
  }, [counts]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-white/50">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Cargando tu colección…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
      <h1 className="text-2xl font-bold">Álbum Mundial 2026</h1>

      {/* Progreso */}
      <div className="mt-3 rounded-xl bg-[var(--color-surface)] p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold">
            {stats.owned} <span className="text-sm font-normal text-white/50">/ {TOTAL_STICKERS}</span>
          </span>
          <span className="text-sm text-white/50">
            faltan {stats.missing} · {stats.repeats} repes
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] transition-all"
            style={{ width: `${(stats.owned / TOTAL_STICKERS) * 100}%` }}
          />
        </div>
      </div>

      {/* Vista: álbum o cambios */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setView("album")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            view === "album" ? "bg-[var(--color-accent)] text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          Álbum
        </button>
        <button
          onClick={() => setView("cambios")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            view === "cambios" ? "bg-amber-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <ArrowLeftRight size={14} />
          Cambios{openTrades > 0 ? ` (${openTrades})` : ""}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300">{error}</p>
      )}

      {view === "cambios" && <TradesPanel api={trades} counts={counts} reserved={reserved} />}

      {view === "album" && (
        <>
      <QuickEntry counts={counts} bump={bump} />

      <FilterBar
        filter={filter}
        onFilter={setFilter}
        group={group}
        onGroup={handleGroup}
        teamCode={teamCode}
        onTeam={handleTeam}
        subtractMode={subtractMode}
        onToggleSubtract={() => setSubtractMode((v) => !v)}
        onExport={() => exportToExcel({ counts, filter, group, teamCode })}
      />

      <div className="mt-4 space-y-3">
        {/* Specials belong to no group, so any group/team filter hides them. */}
        {group === "todos" && teamCode === "todos" && (
          <>
            <SpecialSection
              title="Especiales FIFA"
              codes={SPECIAL_CODES}
              counts={counts}
              reserved={reserved}
              filter={filter}
              subtractMode={subtractMode}
              bump={bump}
            />
            <SpecialSection
              title="Coca-Cola"
              codes={COCA_CODES}
              counts={counts}
              reserved={reserved}
              filter={filter}
              subtractMode={subtractMode}
              bump={bump}
            />
          </>
        )}

        {GROUPS.filter((g) => group === "todos" || g === group).map((g) => {
          const teams = TEAMS.filter(
            (t) => t.group === g && (teamCode === "todos" || t.code === teamCode),
          );
          // Hide the whole group header when the filter leaves nothing to show.
          const hasVisible = teams.some((t) =>
            Array.from(
              { length: STICKERS_PER_TEAM },
              (_, i) => counts[stickerKey(t.code, i + 1)] ?? 0,
            ).some((c) => matchesFilter(c, filter)),
          );
          if (!hasVisible) return null;
          return (
            <section key={g}>
              <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-widest text-white/40">
                Grupo {g}
              </h2>
              <div className="space-y-3">
                {teams.map((team) => (
                  <TeamSection
                    key={team.code}
                    team={team}
                    counts={counts}
                    reserved={reserved}
                    filter={filter}
                    subtractMode={subtractMode}
                    bump={bump}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
        </>
      )}
    </main>
  );
}
