import { Link, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
import { profile } from "../data/content";

export default function AppsLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-bold tracking-tight text-white/70 hover:text-white">
              {profile.name.split(" ")[0]}
              <span className="text-[var(--color-accent)]">.</span>
            </a>
            <Link to="/apps" className="text-sm text-white/50 hover:text-white">
              Apps
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">{user?.username}</span>
            <button
              onClick={logout}
              title="Log out"
              className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
