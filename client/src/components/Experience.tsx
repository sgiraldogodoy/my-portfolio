import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Section from "./Section";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative mx-auto max-w-3xl">
        {/* The vertical rail that ties the timeline together. */}
        <div className="absolute bottom-0 left-5 top-2 w-px bg-gradient-to-b from-[var(--color-accent)] via-white/15 to-transparent" />

        <div className="space-y-6">
          {experience.map((e, i) => (
            <motion.div
              key={e.role + e.org}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06 }}
              className="relative pl-14"
            >
              {/* Node on the rail. */}
              <span className="absolute left-5 top-5 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-bg)] text-[var(--color-accent)] shadow-[0_0_18px_-2px_var(--color-accent)]">
                <Briefcase size={13} />
              </span>

              {/* Card. */}
              <div className="rounded-2xl border border-white/5 bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">
                    {e.role}{" "}
                    <span className="font-normal text-white/50">at {e.org}</span>
                  </h3>
                  <span className="whitespace-nowrap rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent-2)]">
                    {e.period}
                  </span>
                </div>

                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-white/70">
                  {e.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
