import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { login as apiLogin, setAuthToken, type PortalUser } from "./api";
import LoginPage from "../apps/LoginPage";

const STORAGE_KEY = "portfolio.auth";

type AuthState = {
  user: PortalUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function readStored(): { token: string; user: PortalUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.token !== "string" || !parsed?.user?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Trust the stored token on load instead of validating with /auth/me: the
  // backend may take ~45s to cold-start, and any stale token surfaces as a 401
  // on the first real request, which logs the user out anyway.
  const [user, setUser] = useState<PortalUser | null>(() => {
    const stored = readStored();
    if (stored) setAuthToken(stored.token);
    return stored?.user ?? null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await apiLogin(username, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    setAuthToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Renders the login page in place until there's an authenticated user. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  return <>{children}</>;
}
