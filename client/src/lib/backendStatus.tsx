import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// "warming" until the backend answers a health check, then "ready".
// On an always-on host this flips to ready almost instantly; on a sleeping
// free-tier host the first /api/health request wakes it (~30-60s) and we flip
// to ready when it finally responds.
type Status = "warming" | "ready";

const BackendStatusContext = createContext<Status>("warming");

const BASE = import.meta.env.VITE_API_URL ?? "";

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("warming");

  useEffect(() => {
    let cancelled = false;
    // Fire-and-forget warm-up the moment the app mounts, so the backend boots
    // in the background while the visitor browses the (static) site.
    fetch(`${BASE}/api/health`)
      .then((res) => {
        if (!cancelled && res.ok) setStatus("ready");
      })
      .catch(() => {
        /* leave as "warming"; real requests still work, just slower */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BackendStatusContext.Provider value={status}>
      {children}
    </BackendStatusContext.Provider>
  );
}

/** True once the backend has answered a health check (i.e. it's awake). */
export function useBackendReady(): boolean {
  return useContext(BackendStatusContext) === "ready";
}
