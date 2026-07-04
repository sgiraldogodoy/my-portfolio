import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

type AppCard = {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const APPS: AppCard[] = [
  {
    to: "/apps/mundial",
    title: "Álbum Mundial 2026",
    description: "Panini sticker tracker for the 2026 World Cup album.",
    icon: <BookOpen size={22} />,
  },
  // Future apps get a card here.
];

export default function AppsHub() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Apps</h1>
      <p className="mt-1 text-sm text-white/50">Personal tools, invite-only.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map((app) => (
          <Link
            key={app.to}
            to={app.to}
            className="group rounded-2xl border border-white/10 bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/50"
          >
            <span className="inline-flex rounded-xl bg-[var(--color-accent)]/15 p-3 text-[var(--color-accent)]">
              {app.icon}
            </span>
            <h2 className="mt-4 font-semibold group-hover:text-[var(--color-accent)]">
              {app.title}
            </h2>
            <p className="mt-1 text-sm text-white/50">{app.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
