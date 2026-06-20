import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { experience, type Experience as Exp } from "../data/content";

// Convert "YYYY-MM" to an absolute month index for positioning on the axis.
const ym = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return y * 12 + (m - 1);
};

const MIN = Math.min(...experience.map((e) => ym(e.start)));
const MAX = Math.max(...experience.map((e) => ym(e.end)));
const SPAN = MAX - MIN + 1; // inclusive month count

const leftPct = (e: Exp) => ((ym(e.start) - MIN) / SPAN) * 100;
const widthPct = (e: Exp) => ((ym(e.end) - ym(e.start) + 1) / SPAN) * 100;

// Year gridlines / labels (one per January in range).
const firstYear = Math.floor(MIN / 12);
const lastYear = Math.floor(MAX / 12);
const yearMarks = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => {
  const yr = firstYear + i;
  return { yr, pos: ((yr * 12 - MIN) / SPAN) * 100 };
});

const LABEL = "12rem"; // label column width + gap; keeps axis aligned with tracks

export default function Experience() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="experience" title="Experience">
      <p className="mx-auto -mt-6 mb-12 max-w-xl text-center text-white/55">
        Each bar runs from the start to the end of a role. Hover a bar to spotlight that
        role and expand what I did there.
      </p>

      {/* Desktop: Gantt-style timeline */}
      <div className="hidden md:block">
        {/* Year axis */}
        <div className="relative mb-3 h-4" style={{ marginLeft: LABEL }}>
          {yearMarks.map((m) => (
            <span
              key={m.yr}
              className="absolute -translate-x-1/2 font-mono text-xs text-white/40"
              style={{ left: `${m.pos}%` }}
            >
              {m.yr}
            </span>
          ))}
        </div>

        <div className="relative">
          {/* gridlines spanning all rows */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0"
            style={{ left: LABEL }}
          >
            {yearMarks.map((m) => (
              <div
                key={m.yr}
                className="absolute bottom-0 top-0 w-px bg-white/10"
                style={{ left: `${m.pos}%` }}
              />
            ))}
          </div>

          <div className="space-y-2">
            {experience.map((e, i) => {
              const isActive = active === i;
              const dimmed = active !== null && !isActive;
              return (
                <motion.div
                  key={e.role + e.org}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={`relative transition-all duration-300 ${
                    isActive ? "z-10" : ""
                  } ${dimmed ? "opacity-30 blur-[1px]" : "opacity-100"}`}
                >
                  <div className="flex items-center gap-4">
                    {/* label */}
                    <div
                      className={`shrink-0 text-right transition-all duration-300 ${
                        isActive ? "scale-[1.03]" : ""
                      }`}
                      style={{ width: "11rem", transformOrigin: "right center" }}
                    >
                      <p
                        className={`text-sm font-semibold leading-tight transition-colors ${
                          isActive ? "text-[var(--color-accent-2)]" : ""
                        }`}
                      >
                        {e.role}
                      </p>
                      <p className="text-xs text-white/50">{e.org}</p>
                    </div>

                    {/* track + bar */}
                    <div className="relative h-9 flex-1">
                      <button
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        className={`absolute inset-y-0 my-auto flex items-center overflow-hidden rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-3 text-left outline-none transition-all duration-300 ${
                          isActive
                            ? "h-9 ring-2 ring-[var(--color-accent)] shadow-[0_0_30px_-4px_var(--color-accent)] saturate-150"
                            : "h-6 shadow-[0_0_16px_-7px_var(--color-accent)]"
                        }`}
                        style={{
                          left: `${leftPct(e)}%`,
                          width: `${widthPct(e)}%`,
                          minWidth: "3.5rem",
                        }}
                        aria-label={`${e.role} at ${e.org}, ${e.period}`}
                      >
                        <span className="truncate font-mono text-[11px] font-medium text-white/95">
                          {e.period}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* detail (expands when this role is active) */}
                  <div
                    className={`grid transition-all duration-500 ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="mt-2 rounded-xl border border-white/10 border-l-2 border-l-[var(--color-accent)] bg-[var(--color-surface)] p-4"
                        style={{ marginLeft: LABEL }}
                      >
                        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--color-accent-2)]">
                          {e.period}
                        </p>
                        <ul className="list-disc space-y-1.5 pl-5 text-sm text-white/75">
                          {e.points.map((pt, j) => (
                            <li key={j}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: simple stacked list (no hover) */}
      <div className="space-y-6 md:hidden">
        {experience.map((e) => (
          <div
            key={e.role + e.org}
            className="border-l-2 border-[var(--color-accent)]/50 pl-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent-2)]">
              {e.period}
            </p>
            <h3 className="mt-1 font-semibold">{e.role}</h3>
            <p className="text-sm text-white/50">{e.org}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
              {e.points.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
