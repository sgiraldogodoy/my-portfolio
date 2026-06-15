import Section from "./Section";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative space-y-10 border-l border-white/10 pl-8">
        {experience.map((e) => (
          <div key={e.role + e.org} className="relative">
            <span className="absolute -left-[2.45rem] top-1 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">
                {e.role} <span className="text-white/50">· {e.org}</span>
              </h3>
              <span className="text-sm text-white/40">{e.period}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-white/70">
              {e.points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
