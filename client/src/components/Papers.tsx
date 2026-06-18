import { motion } from "framer-motion";
import { Award, ExternalLink, FileText } from "lucide-react";
import Section from "./Section";
import { papers } from "../data/content";

export default function Papers() {
  if (papers.length === 0) return null;

  return (
    <Section id="papers" title="Papers & Research">
      <div className="grid gap-6">
        {papers.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/5 bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/40"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <span className="text-sm text-white/40">{p.date}</span>
            </div>

            <p className="mt-1 text-sm text-[var(--color-accent-2)]">{p.venue}</p>
            {p.authors && <p className="text-sm text-white/50">{p.authors}</p>}

            {p.award && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-300">
                <Award size={14} /> {p.award}
              </p>
            )}

            <p className="mt-3 text-white/75">{p.description}</p>

            {p.tags && p.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(p.pdfUrl || p.link) && (
              <div className="mt-5 flex gap-4 text-sm">
                {p.pdfUrl && (
                  <a
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--color-accent-2)] hover:underline"
                  >
                    <FileText size={16} /> Read PDF
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-white/70 hover:text-white"
                  >
                    <ExternalLink size={16} /> Link
                  </a>
                )}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
