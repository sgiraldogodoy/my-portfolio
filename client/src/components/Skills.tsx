import { motion } from "framer-motion";
import Section from "./Section";
import { skills } from "../data/content";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid gap-8 md:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.category}
            className="rounded-2xl border border-white/5 bg-[var(--color-surface)] p-6"
          >
            <h3 className="mb-5 text-lg font-semibold text-[var(--color-accent-2)]">
              {group.category}
            </h3>
            <ul className="space-y-4">
              {group.items.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between text-sm text-white/80">
                    <span>{s.name}</span>
                    <span className="text-white/40">{s.level}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
