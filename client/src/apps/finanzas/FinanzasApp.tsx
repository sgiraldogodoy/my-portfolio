import { useMemo, useState, type FormEvent } from "react";
import { ArrowDownCircle, ArrowUpCircle, FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { ACCOUNTS, CATEGORIES, type Account, type Category, type Transaction } from "./data/constants";
import { exportToExcel } from "./exportExcel";
import ImportStatement from "./ImportStatement";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]";

/**
 * Registro de transacciones de una sola sesión: todo vive en estado de React,
 * nada se guarda en el servidor y se pierde al salir de la página.
 */
export default function FinanzasApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState<Account>(ACCOUNTS[0]);
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [direction, setDirection] = useState<"out" | "in">("out");
  const [amount, setAmount] = useState("");
  const [exporting, setExporting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!description.trim() || !date || !Number.isFinite(value) || value <= 0) return;
    setTransactions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date,
        description: description.trim(),
        account,
        category,
        amount: direction === "out" ? -value : value,
      },
    ]);
    // La fecha, cuenta y categoría se quedan para agilizar entradas seguidas.
    setDescription("");
    setAmount("");
  }

  function remove(id: string) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportToExcel(transactions);
    } finally {
      setExporting(false);
    }
  }

  const balances = useMemo(() => {
    const map = new Map<Account, number>(ACCOUNTS.map((a) => [a, 0]));
    for (const tx of transactions) map.set(tx.account, (map.get(tx.account) ?? 0) + tx.amount);
    return map;
  }, [transactions]);

  const total = useMemo(
    () => transactions.reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Transacciones</h1>
          <p className="mt-1 text-sm text-white/50">
            Solo esta sesión: nada se guarda, los datos desaparecen al salir de la página.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={transactions.length === 0 || exporting}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FileSpreadsheet size={16} />
          {exporting ? "Generando…" : "Exportar a Excel"}
        </button>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <label className="block lg:col-span-2">
            <span className="mb-1 block text-xs text-white/50">Fecha</span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2 lg:col-span-4">
            <span className="mb-1 block text-xs text-white/50">Descripción</span>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Almuerzo en la cafetería"
              className={inputClass}
            />
          </label>
          <label className="block lg:col-span-3">
            <span className="mb-1 block text-xs text-white/50">Cuenta</span>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value as Account)}
              className={inputClass}
            >
              {ACCOUNTS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="block lg:col-span-3">
            <span className="mb-1 block text-xs text-white/50">Categoría</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <div className="lg:col-span-4">
            <span className="mb-1 block text-xs text-white/50">Tipo</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("out")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                  direction === "out"
                    ? "border-red-400/60 bg-red-500/15 text-red-300"
                    : "border-white/10 text-white/50 hover:text-white"
                }`}
              >
                <ArrowDownCircle size={15} /> Salida
              </button>
              <button
                type="button"
                onClick={() => setDirection("in")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                  direction === "in"
                    ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 text-white/50 hover:text-white"
                }`}
              >
                <ArrowUpCircle size={15} /> Entrada
              </button>
            </div>
          </div>
          <label className="block lg:col-span-4">
            <span className="mb-1 block text-xs text-white/50">Monto</span>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </label>
          <div className="flex items-end lg:col-span-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
        </div>
      </form>

      {/* Escaneo de extractos con IA */}
      <ImportStatement onImport={(txs) => setTransactions((prev) => [...prev, ...txs])} />

      {/* Balances por cuenta */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          Balance por cuenta
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ACCOUNTS.map((a) => {
            const balance = balances.get(a) ?? 0;
            return (
              <div
                key={a}
                className={`rounded-xl border border-white/10 bg-[var(--color-surface)] px-3 py-2 ${
                  balance === 0 ? "opacity-40" : ""
                }`}
              >
                <p className="truncate text-xs text-white/50">{a}</p>
                <p
                  className={`text-sm font-semibold ${
                    balance < 0 ? "text-red-300" : balance > 0 ? "text-emerald-300" : ""
                  }`}
                >
                  {money.format(balance)}
                </p>
              </div>
            );
          })}
          <div className="rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-2">
            <p className="text-xs text-white/50">Total</p>
            <p className="text-sm font-semibold">{money.format(total)}</p>
          </div>
        </div>
      </section>

      {/* Tabla de transacciones */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          Movimientos ({transactions.length})
        </h2>
        {transactions.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/40">
            Aún no hay transacciones. Agrega la primera con el formulario.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-surface)] text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">Descripción</th>
                  <th className="px-3 py-2 font-medium">Cuenta</th>
                  <th className="px-3 py-2 font-medium">Categoría</th>
                  <th className="px-3 py-2 text-right font-medium">Monto</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-white/5">
                    <td className="whitespace-nowrap px-3 py-2 text-white/70">{tx.date}</td>
                    <td className="px-3 py-2">{tx.description}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-white/70">{tx.account}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-white/70">{tx.category}</td>
                    <td
                      className={`whitespace-nowrap px-3 py-2 text-right font-medium ${
                        tx.amount < 0 ? "text-red-300" : "text-emerald-300"
                      }`}
                    >
                      {money.format(tx.amount)}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => remove(tx.id)}
                        title="Eliminar"
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
        )}
      </section>
    </main>
  );
}
