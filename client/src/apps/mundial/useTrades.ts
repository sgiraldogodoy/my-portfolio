import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  authorizeTrade,
  createTrade,
  deleteTrade,
  getTrades,
  updateTrade,
  type Trade,
} from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Counts } from "./useCollection";

/** Trade sessions ("cambios") with server persistence. */
export function useTrades(onCollectionChange: (stickers: Counts) => void) {
  const { logout } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tradesRef = useRef<Trade[]>([]);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Mirror of `trades` for the debounced save timers, which outlive a render.
  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) return logout();
      setError(err instanceof Error ? err.message : "Algo salió mal");
      setTimeout(() => setError(null), 4000);
    },
    [logout],
  );

  useEffect(() => {
    let cancelled = false;
    getTrades()
      .then(({ trades }) => {
        if (!cancelled) setTrades(trades);
      })
      .catch((err) => {
        if (!cancelled) fail(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fail]);

  const create = useCallback(
    async (name: string) => {
      try {
        const { trade } = await createTrade(name);
        setTrades((prev) => [trade, ...prev]);
        return trade;
      } catch (err) {
        fail(err);
        return null;
      }
    },
    [fail],
  );

  const save = useCallback(
    async (id: string, patch: Partial<Pick<Trade, "name" | "give" | "receive">>) => {
      try {
        const { trade } = await updateTrade(id, patch);
        setTrades((prev) => prev.map((t) => (t.id === id ? trade : t)));
        return true;
      } catch (err) {
        fail(err);
        return false;
      }
    },
    [fail],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteTrade(id);
        setTrades((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        fail(err);
      }
    },
    [fail],
  );

  const authorize = useCallback(
    async (id: string) => {
      try {
        const { trade, stickers } = await authorizeTrade(id);
        setTrades((prev) => prev.map((t) => (t.id === id ? trade : t)));
        onCollectionChange(stickers);
        return true;
      } catch (err) {
        fail(err);
        return false;
      }
    },
    [fail, onCollectionChange],
  );

  /** Optimistic local update (no server call) — pair with saveSoon/flush. */
  const patchLocal = useCallback(
    (id: string, patch: Partial<Pick<Trade, "name" | "give" | "receive">>) => {
      setTrades((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [],
  );

  /** Persists the current local state of a trade right away. */
  const flush = useCallback(
    async (id: string) => {
      clearTimeout(saveTimers.current[id]);
      const t = tradesRef.current.find((t) => t.id === id);
      if (!t || t.status !== "abierto") return;
      try {
        // Don't overwrite local state with the response: newer taps may have
        // landed while this request was in flight.
        await updateTrade(id, { name: t.name, give: t.give, receive: t.receive });
      } catch (err) {
        fail(err);
      }
    },
    [fail],
  );

  /** Debounced flush, so a burst of album taps becomes one request. */
  const saveSoon = useCallback(
    (id: string) => {
      clearTimeout(saveTimers.current[id]);
      saveTimers.current[id] = setTimeout(() => void flush(id), 800);
    },
    [flush],
  );

  return { trades, loading, error, create, save, remove, authorize, patchLocal, saveSoon, flush };
}
