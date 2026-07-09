import { useCallback, useEffect, useState } from "react";
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

  return { trades, loading, error, create, save, remove, authorize };
}
