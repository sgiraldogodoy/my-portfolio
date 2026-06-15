import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import Section from "./Section";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex flex-col rounded-2xl border border-white/5 bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/40"
          >
            {p.featured && (
              <span className="absolute right-4 top-4 flex items-center gap-1 text-xs text-amber-300">
                <Star size={14} /> Featured
              </span>
            )}
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 flex-1 text-white/70">{p.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-4 text-sm">
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[var(--color-accent-2)] hover:underline"
                >
                  <ExternalLink size={16} /> Live
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-white/70 hover:text-white"
                >
                  <Github size={16} /> Code
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
