import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useBackendReady } from "../lib/backendStatus";

export default function LoginPage() {
  const { login } = useAuth();
  const backendReady = useBackendReady();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-xl bg-[var(--color-accent)]/15 p-2 text-[var(--color-accent)]">
            <Lock size={20} />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Private apps</h1>
            <p className="text-sm text-white/50">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            autoCapitalize="none"
            required
            className="w-full rounded-lg border border-white/10 bg-[var(--color-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-white/10 bg-[var(--color-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!backendReady && (
            <p className="text-xs text-white/40">
              Waking up the server… the first sign-in can take up to a minute.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <a href="/" className="mt-6 block text-center text-xs text-white/40 hover:text-white/70">
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}
