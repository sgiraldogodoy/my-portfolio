import { useRef, useState } from "react";
import { Check, Loader2, ScanLine, Trash2, X } from "lucide-react";
import { ApiError, scanStatement, type ScannedTransaction } from "../../lib/api";
import { ACCOUNTS, CATEGORIES, type Account, type Category, type Transaction } from "./data/constants";

const MAX_PDF_BYTES = 10 * 1024 * 1024;

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type Row = ScannedTransaction & { id: string };

type Props = {
  onImport: (transactions: Transaction[]) => void;
};

/**
 * Escanea un extracto en PDF con IA y propone transacciones para revisar.
 * El PDF se envía al servidor, que lo procesa en memoria; nada se guarda.
 */
export default function ImportStatement({ onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [account, setAccount] = useState<Account>(ACCOUNTS[0]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Selecciona un archivo PDF.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError("El PDF supera el límite de 10 MB.");
      return;
    }
    setScanning(true);
    try {
      const base64 = await readAsBase64(file);
      const { transactions } = await scanStatement(base64);
      if (transactions.length === 0) {
        setError("No se encontraron transacciones en el documento.");
        return;
      }
      setRows(transactions.map((tx) => ({ ...tx, id: crypto.randomUUID() })));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo escanear el PDF.");
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, ...patch } : r)) ?? null);
  }

  function accept() {
    if (!rows) return;
    onImport(
      rows.map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        account,
        category: (CATEGORIES as readonly string[]).includes(r.category)
          ? (r.category as Category)
          : "Movimientos",
        amount: r.direction === "out" ? -r.amount : r.amount,
      })),
    );
    setRows(null);
  }

  return (
    <section className="mt-6">
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!rows && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-[var(--color-surface)]/50 px-4 py-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:border-[var(--color-accent)]/60 disabled:opacity-50"
          >
            {scanning ? <Loader2 size={15} className="animate-spin" /> : <ScanLine size={15} />}
            {scanning ? "Escaneando con IA…" : "Escanear extracto (PDF)"}
          </button>
          <p className="text-xs text-white/40">
            El PDF se procesa en memoria y no se guarda en ningún lado.
          </p>
          {error && <p className="w-full text-sm text-red-300">{error}</p>}
        </div>
      )}

      {rows && (
        <div className="rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-surface)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">
                Revisar {rows.length} transacción{rows.length === 1 ? "" : "es"} detectada
                {rows.length === 1 ? "" : "s"}
              </h2>
              <label className="flex items-center gap-2 text-xs text-white/50">
                Cuenta:
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value as Account)}
                  className="rounded-lg border border-white/10 bg-[var(--color-bg)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRows(null)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/60 transition hover:text-white"
              >
                <X size={14} /> Descartar
              </button>
              <button
                onClick={accept}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Check size={14} /> Agregar todas
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/5 first:border-t-0">
                    <td className="whitespace-nowrap px-3 py-2 text-white/70">{r.date}</td>
                    <td className="max-w-60 truncate px-3 py-2" title={r.description}>
                      {r.description}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={r.category}
                        onChange={(e) => updateRow(r.id, { category: e.target.value })}
                        className="rounded-lg border border-white/10 bg-[var(--color-bg)] px-2 py-1 text-xs outline-none focus:border-[var(--color-accent)]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() =>
                          updateRow(r.id, { direction: r.direction === "out" ? "in" : "out" })
                        }
                        title="Cambiar entrada/salida"
                        className={`whitespace-nowrap rounded-md px-2 py-1 font-medium transition hover:bg-white/10 ${
                          r.direction === "out" ? "text-red-300" : "text-emerald-300"
                        }`}
                      >
                        {money.format(r.direction === "out" ? -r.amount : r.amount)}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => setRows((prev) => prev!.filter((x) => x.id !== r.id))}
                        title="Quitar"
                        className="rounded-md p-1.5 text-white/30 transition hover:bg-red-500/15 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Toca el monto para cambiar entre entrada y salida. Revisa las categorías sugeridas por
            la IA antes de agregar.
          </p>
        </div>
      )}
    </section>
  );
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
