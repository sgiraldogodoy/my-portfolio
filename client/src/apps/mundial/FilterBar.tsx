import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { GROUPS, TEAMS } from "./data/album";

export type Filter = "todas" | "faltan" | "tengo" | "repetidas";

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "faltan", label: "Faltan" },
  { id: "tengo", label: "Tengo" },
  { id: "repetidas", label: "Repetidas" },
];

/** True when a sticker with this count should be visible under the filter. */
export function matchesFilter(count: number, filter: Filter): boolean {
  switch (filter) {
    case "todas":
      return true;
    case "faltan":
      return count === 0;
    case "tengo":
      return count >= 1;
    case "repetidas":
      return count >= 2;
  }
}

type Props = {
  filter: Filter;
  onFilter: (f: Filter) => void;
  group: string; // "todos" | "A".."L"
  onGroup: (g: string) => void;
  teamCode: string; // "todos" | team code
  onTeam: (code: string) => void;
  subtractMode: boolean;
  onToggleSubtract: () => void;
  onExport: () => void;
  /** Extra content pinned at the top of the sticky bar (e.g. trade-mode banner). */
  banner?: ReactNode;
};

const selectClass =
  "min-w-0 flex-1 appearance-none rounded-lg border border-white/10 bg-[var(--color-surface)] px-3 py-1.5 text-sm text-white/80 outline-none focus:border-[var(--color-accent)]";

export default function FilterBar({
  filter,
  onFilter,
  group,
  onGroup,
  teamCode,
  onTeam,
  subtractMode,
  onToggleSubtract,
  onExport,
  banner,
}: Props) {
  // The team dropdown narrows to the selected group.
  const teamOptions = group === "todos" ? TEAMS : TEAMS.filter((t) => t.group === group);

  return (
    <div className="sticky top-[57px] z-30 -mx-4 border-b border-white/10 bg-[var(--color-bg)]/95 px-4 py-2 backdrop-blur">
      {banner}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onFilter(id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === id
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px shrink-0 bg-white/10" />
        <button
          onClick={onToggleSubtract}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            subtractMode
              ? "bg-red-500/80 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          − Modo restar
        </button>
      </div>
      <div className="mt-1 flex gap-2 pb-1">
        <select value={group} onChange={(e) => onGroup(e.target.value)} className={selectClass}>
          <option value="todos">Todos los grupos</option>
          {GROUPS.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
        <select value={teamCode} onChange={(e) => onTeam(e.target.value)} className={selectClass}>
          <option value="todos">Todos los equipos</option>
          {teamOptions.map((t) => (
            <option key={t.code} value={t.code}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={onExport}
          title="Exportar lo filtrado a Excel"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-[var(--color-surface)] px-3 py-1.5 text-sm text-white/80 transition hover:border-[var(--color-accent)] hover:text-white"
        >
          <Download size={14} />
          Excel
        </button>
      </div>
      {subtractMode && (
        <p className="pb-1 text-xs text-red-300/80">
          Modo restar activo: al tocar una estampa se quita una.
        </p>
      )}
    </div>
  );
}
