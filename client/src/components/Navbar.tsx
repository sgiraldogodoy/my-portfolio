import { useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/content";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#papers", label: "Papers" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[var(--color-bg)]/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold tracking-tight">
          {profile.name.split(" ")[0]}
          <span className="text-[var(--color-accent)]">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            download
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Resume
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 px-6 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-white/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            download
            className="mt-2 inline-block rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold"
          >
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
