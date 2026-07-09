import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, getCollection, updateSticker } from "../../lib/api";
import { useAuth } from "../../lib/auth";

export type Counts = Record<string, number>;

/**
 * Per-user sticker counts with optimistic updates: the UI changes instantly
 * and reconciles with the server response (important with a free-tier backend
 * that can be slow). A 401 anywhere means the token expired -> log out.
 */
export function useCollection() {
  const { logout } = useAuth();
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Tracks in-flight updates per code so slow responses don't clobber newer taps.
  const pending = useRef<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    getCollection()
      .then(({ stickers }) => {
        if (!cancelled) setCounts(stickers);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) return logout();
        setError("No se pudo cargar tu colección. Recarga la página.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  const bump = useCallback(
    (code: string, delta: 1 | -1) => {
      let skipped = false;
      setCounts((prev) => {
        const current = prev[code] ?? 0;
        if (delta === -1 && current === 0) {
          skipped = true;
          return prev;
        }
        return { ...prev, [code]: current + delta };
      });
      if (skipped) return;

      pending.current[code] = (pending.current[code] ?? 0) + 1;
      updateSticker(code, delta)
        .then(({ count }) => {
          pending.current[code] -= 1;
          // Only reconcile once no other update for this code is in flight.
          if (pending.current[code] === 0) {
            setCounts((prev) => ({ ...prev, [code]: count }));
          }
        })
        .catch((err) => {
          pending.current[code] -= 1;
          if (err instanceof ApiError && err.status === 401) return logout();
          // Revert the optimistic change.
          setCounts((prev) => ({
            ...prev,
            [code]: Math.max(0, (prev[code] ?? 0) - delta),
          }));
          setError("No se pudo guardar el cambio. Intenta de nuevo.");
          setTimeout(() => setError(null), 3000);
        });
    },
    [logout],
  );

  /** Replaces all counts at once (e.g. after authorizing a trade). */
  const replace = useCallback((stickers: Counts) => {
    setCounts(stickers);
  }, []);

  return { counts, loading, error, bump, replace };
}
