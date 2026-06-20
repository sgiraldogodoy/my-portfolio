import { motion } from "framer-motion";
import Section from "./Section";
import { experience, type Experience as Exp } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <p className="mx-auto -mt-6 mb-16 max-w-xl text-center text-white/55">
        My journey so far. Hover a node to expand what I did at each stop.
      </p>

      <div className="relative mx-auto max-w-5xl">
        {/* Central line (far left on mobile, centered on desktop). */}
        <div className="absolute bottom-0 left-4 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-2)]/60 to-transparent opacity-50 md:left-1/2" />

        <div className="space-y-10 md:space-y-2">
          {experience.map((e, i) => (
            <TimelineItem key={e.role + e.org} item={e} flip={i % 2 === 1} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineItem({ item, flip, index }: { item: Exp; flip: boolean; index: number }) {
  // flip === false: summary left, detail card right.
  // flip === true:  detail card left, summary right.
  const summaryCol = flip ? "md:col-start-2 md:text-left md:pl-16" : "md:col-start-1 md:text-right md:pr-16";
  const detailCol = flip
    ? "md:col-start-1 md:row-start-1 md:pr-16"
    : "md:col-start-2 md:row-start-1 md:pl-16";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05 }}
      className="group relative md:grid md:grid-cols-2 md:items-center md:gap-x-8"
    >
      {/* Node on the line. */}
      <span className="absolute left-4 top-1.5 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-accent)] shadow-[0_0_18px_-2px_var(--color-accent)] transition-transform duration-300 group-hover:scale-125 md:left-1/2" />

      {/* Summary (always visible). */}
      <div className={`pl-12 md:pl-0 ${summaryCol}`}>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent-2)]">
          {item.period}
        </p>
        <h3 className="mt-1 text-xl font-bold">{item.role}</h3>
        <p className="text-white/55">{item.org}</p>
      </div>

      {/* Detail card (hover-reveal on desktop, always shown on mobile). */}
      <div className={`pl-12 md:pl-0 ${detailCol}`}>
        <div
          className={`mt-3 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-5 transition-all duration-500 md:mt-0 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
            flip
              ? "md:border-r-2 md:border-r-[var(--color-accent)] md:text-right"
              : "md:border-l-2 md:border-l-[var(--color-accent)]"
          }`}
        >
          <ul className="space-y-2 text-sm text-white/75">
            {item.points.map((pt, j) => (
              <li key={j}>{pt}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
