import { useState, type FormEvent } from "react";
import { Check, ChevronDown, Hand, Minus, Plus, Trash2 } from "lucide-react";
import { parseCode } from "./parseCode";
import { displayCode } from "./data/album";
import type { Trade } from "../../lib/api";
import type { Counts } from "./useCollection";
import type { useTrades } from "./useTrades";

type TradesApi = ReturnType<typeof useTrades>;

type Props = {
  api: TradesApi;
  counts: Counts;
  /** Total copies reserved per code across all OPEN trades (saved state). */
  reserved: Record<string, number>;
  /** Switches to the album in "modo cambio" for this trade. */
  onEnterAlbum: (tradeId: string) => void;
};

export default function TradesPanel({ api, counts, reserved, onEnterAlbum }: Props) {
  const [newName, setNewName] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const trade = await api.create(name);
    if (trade) setNewName("");
  }

  const open = api.trades.filter((t) => t.status === "abierto");
  const done = api.trades.filter((t) => t.status === "completado");

  return (
    <div className="mt-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del cambio (ej. Cambio con Juan)"
          maxLength={100}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Crear
        </button>
      </form>

      {api.error && (
        <p className="mt-3 rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300">{api.error}</p>
      )}

      {api.loading ? (
        <p className="mt-6 text-sm text-white/50">Cargando cambios…</p>
      ) : api.trades.length === 0 ? (
        <p className="mt-6 text-sm text-white/50">
          Aún no hay cambios. Crea uno para apartar estampas.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {open.map((trade) => (
            <TradeCard
              key={`${trade.id}:${JSON.stringify(trade.give)}:${JSON.stringify(trade.receive)}`}
              trade={trade}
              api={api}
              counts={counts}
              reserved={reserved}
              expanded={expandedId === trade.id}
              onToggle={() => setExpandedId((v) => (v === trade.id ? null : trade.id))}
              onEnterAlbum={onEnterAlbum}
            />
          ))}
          {done.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/40">
                Completados
              </h2>
              {done.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  api={api}
                  counts={counts}
                  reserved={reserved}
                  expanded={expandedId === trade.id}
                  onToggle={() => setExpandedId((v) => (v === trade.id ? null : trade.id))}
                  onEnterAlbum={onEnterAlbum}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TradeCard({
  trade,
  api,
  counts,
  reserved,
  expanded,
  onToggle,
  onEnterAlbum,
}: {
  trade: Trade;
  api: TradesApi;
  counts: Counts;
  reserved: Record<string, number>;
  expanded: boolean;
  onToggle: () => void;
  onEnterAlbum: (tradeId: string) => void;
}) {
  const [name, setName] = useState(trade.name);
  const [give, setGive] = useState<Record<string, number>>(trade.give);
  const [receive, setReceive] = useState<Record<string, number>>(trade.receive);
  const [saving, setSaving] = useState(false);
  const isOpen = trade.status === "abierto";

  const dirty =
    name !== trade.name ||
    JSON.stringify(give) !== JSON.stringify(trade.give) ||
    JSON.stringify(receive) !== JSON.stringify(trade.receive);

  // Copies still free to promise in THIS trade: spares minus what other open
  // trades already reserve (this trade's saved share doesn't count against it).
  function maxGive(code: string): number {
    const spares = Math.max(0, (counts[code] ?? 0) - 1);
    const others = (reserved[code] ?? 0) - (trade.give[code] ?? 0);
    return Math.max(0, spares - others);
  }

  async function handleSave() {
    setSaving(true);
    await api.save(trade.id, { name: name.trim() || trade.name, give, receive });
    setSaving(false);
  }

  async function handleAuthorize() {
    if (dirty) {
      const ok = await api.save(trade.id, { name: name.trim() || trade.name, give, receive });
      if (!ok) return;
    }
    if (!window.confirm(`¿Autorizar "${trade.name}"? Se aplicará a tu colección.`)) return;
    await api.authorize(trade.id);
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el cambio "${trade.name}"?`)) return;
    await api.remove(trade.id);
  }

  const giveTotal = Object.values(trade.give).reduce((a, b) => a + b, 0);
  const receiveTotal = Object.values(trade.receive).reduce((a, b) => a + b, 0);

  return (
    <div
      className={`rounded-xl border bg-[var(--color-surface)]/60 ${
        isOpen ? "border-amber-400/30" : "border-white/10 opacity-70"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate font-semibold">{trade.name}</span>
          <span className="text-xs text-white/50">
            {isOpen ? "Abierto" : "Completado"} · doy {giveTotal} · recibo {receiveTotal}
          </span>
        </span>
        <ChevronDown size={16} className={`shrink-0 transition ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-4 pb-4">
          {isOpen && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="mt-3 w-full rounded-lg border border-white/10 bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          )}

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <TradeSide
              title="Doy (se apartan)"
              accent="text-amber-300"
              items={give}
              editable={isOpen}
              onChange={setGive}
              maxFor={maxGive}
              counts={counts}
            />
            <TradeSide
              title="Recibo"
              accent="text-emerald-300"
              items={receive}
              editable={isOpen}
              onChange={setReceive}
              counts={counts}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isOpen && (
              <>
                <button
                  onClick={handleSave}
                  disabled={!dirty || saving}
                  className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  {saving ? "Guardando…" : dirty ? "Guardar" : "Guardado"}
                </button>
                <button
                  onClick={() => onEnterAlbum(trade.id)}
                  className="flex items-center gap-1 rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/10"
                >
                  <Hand size={14} />
                  Apartar en álbum
                </button>
                <button
                  onClick={handleAuthorize}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Check size={14} />
                  Autorizar
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="ml-auto flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TradeSide({
  title,
  accent,
  items,
  editable,
  onChange,
  maxFor,
  counts,
}: {
  title: string;
  accent: string;
  items: Record<string, number>;
  editable: boolean;
  onChange: (items: Record<string, number>) => void;
  maxFor?: (code: string) => number;
  counts: Counts;
}) {
  const [value, setValue] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function bump(code: string, delta: number) {
    const next = { ...items };
    const qty = (next[code] ?? 0) + delta;
    if (qty <= 0) delete next[code];
    else next[code] = qty;
    onChange(next);
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const code = parseCode(value);
    if (!code) {
      setNote("Código inválido");
      setTimeout(() => setNote(null), 2000);
      return;
    }
    if (maxFor && (items[code] ?? 0) + 1 > maxFor(code)) {
      setNote(`No hay repes libres de ${displayCode(code)}`);
      setTimeout(() => setNote(null), 2500);
      return;
    }
    bump(code, 1);
    setValue("");
  }

  const codes = Object.keys(items).sort();

  return (
    <div>
      <h3 className={`text-sm font-semibold ${accent}`}>{title}</h3>
      {editable && (
        <form onSubmit={handleAdd} className="mt-2 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Código"
            autoCapitalize="characters"
            autoCorrect="off"
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
          >
            <Plus size={14} />
          </button>
        </form>
      )}
      {note && <p className="mt-1 text-xs text-red-400">{note}</p>}
      <ul className="mt-2 space-y-1">
        {codes.length === 0 && <li className="text-xs text-white/40">Sin estampas.</li>}
        {codes.map((code) => (
          <li
            key={code}
            className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] px-3 py-1.5 text-sm"
          >
            <span>
              {displayCode(code)}
              {maxFor && (
                <span className="ml-2 text-xs text-white/40">
                  tienes ×{counts[code] ?? 0}
                </span>
              )}
            </span>
            <span className="flex items-center gap-1">
              {editable ? (
                <>
                  <button
                    onClick={() => bump(code, -1)}
                    className="rounded p-1 text-white/60 transition hover:bg-white/10"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold">{items[code]}</span>
                  <button
                    onClick={() => bump(code, 1)}
                    disabled={maxFor ? items[code] + 1 > maxFor(code) : false}
                    className="rounded p-1 text-white/60 transition hover:bg-white/10 disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </>
              ) : (
                <span className="font-semibold">×{items[code]}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
