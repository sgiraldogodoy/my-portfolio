import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { techStack } from "../../data/techStack";
import { projects } from "../../data/content";

const filters = [{ key: "all", label: "All" }, ...techStack.map((c) => ({ key: c.key, label: c.label }))];

export default function ConstellationStack() {
  const [active, setActive] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const items = useMemo(() => {
    const cats = active === "all" ? techStack : techStack.filter((c) => c.key === active);
    return cats.flatMap((c) => c.items.map((name) => ({ name, category: c.label })));
  }, [active]);

  const relatedProjects = useMemo(() => {
    if (!hovered) return [];
    const h = hovered.toLowerCase();
    return projects
      .filter((p) => p.tech.some((t) => t.toLowerCase().includes(h) || h.includes(t.toLowerCase())))
      .map((p) => p.title);
  }, [hovered]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              active === f.key
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="flex flex-wrap justify-center gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((it) => {
            const isRelated =
              hovered && relatedProjects.length > 0 && it.name === hovered;
            return (
              <motion.button
                key={it.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHovered(it.name)}
                onMouseLeave={() => setHovered(null)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  isRelated
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                    : "border-white/10 bg-[var(--color-surface)] text-white/80 hover:border-[var(--color-accent-2)]/50"
                }`}
              >
                {it.name}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 min-h-[3rem] text-center text-sm">
        {hovered ? (
          relatedProjects.length > 0 ? (
            <p className="text-white/70">
              <span className="font-semibold text-white">{hovered}</span> is used in:{" "}
              <span className="text-[var(--color-accent-2)]">
                {relatedProjects.join(", ")}
              </span>
            </p>
          ) : (
            <p className="text-white/40">
              <span className="font-semibold text-white/70">{hovered}</span> is part of
              the toolkit (no linked project yet).
            </p>
          )
        ) : (
          <p className="text-white/40">Hover a technology to see where it shows up.</p>
        )}
      </div>
    </div>
  );
}
