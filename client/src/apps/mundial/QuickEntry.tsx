import { useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { parseCode } from "./parseCode";
import { displayCode } from "./data/album";
import type { Counts } from "./useCollection";

type Props = {
  counts: Counts;
  bump: (code: string, delta: 1 | -1) => void;
};

type Flash = { kind: "ok" | "error"; text: string };

/** Entrada rápida: escribe "CZE 7", "fwc3", "cc5" o "00" y presiona Agregar. */
export default function QuickEntry({ counts, bump }: Props) {
  const [value, setValue] = useState("");
  const [flash, setFlash] = useState<Flash | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(f: Flash) {
    if (timer.current) clearTimeout(timer.current);
    setFlash(f);
    timer.current = setTimeout(() => setFlash(null), 2500);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = parseCode(value);
    if (!code) {
      show({ kind: "error", text: `Código inválido: "${value.trim()}"` });
      return;
    }
    bump(code, 1);
    const nowHave = (counts[code] ?? 0) + 1;
    show({
      kind: "ok",
      text: `${displayCode(code)} ✓ ${nowHave > 1 ? `ahora tienes ${nowHave}` : "agregada"}`,
    });
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Código (ej. CZE 7, FWC 3, CC 5, 00)"
          autoCapitalize="characters"
          autoCorrect="off"
          enterKeyHint="done"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>
      <p
        className={`mt-2 min-h-5 text-sm ${
          flash ? (flash.kind === "ok" ? "text-emerald-400" : "text-red-400") : "text-transparent"
        }`}
      >
        {flash?.text ?? "."}
      </p>
    </form>
  );
}
