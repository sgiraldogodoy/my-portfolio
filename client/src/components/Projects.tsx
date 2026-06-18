import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, PlayCircle, Star, X } from "lucide-react";
import Section from "./Section";
import { projects, type Project } from "../data/content";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  // Close the modal on Escape, and lock background scroll while it's open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.button
            key={p.title}
            type="button"
            onClick={() => setActive(p)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex flex-col rounded-2xl border border-white/5 bg-[var(--color-surface)] p-6 text-left transition hover:border-[var(--color-accent)]/40 hover:bg-white/[0.04]"
          >
            {p.featured && (
              <span className="absolute right-4 top-4 flex items-center gap-1 text-xs text-amber-300">
                <Star size={14} /> Featured
              </span>
            )}
            <h3 className="pr-20 text-xl font-semibold">{p.title}</h3>
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

            <span className="mt-4 text-sm font-medium text-[var(--color-accent-2)] opacity-0 transition group-hover:opacity-100">
              View details →
            </span>
          </motion.button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X />
            </button>

            <h3 className="pr-10 text-2xl font-bold">{project.title}</h3>

            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="mt-5 w-full rounded-xl border border-white/10"
              />
            )}

            <p className="mt-4 text-white/80">
              {project.details ?? project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-5 list-disc space-y-2 pl-5 text-white/75">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>

            {(project.liveUrl || project.repoUrl || project.videoUrl) && (
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--color-accent-2)] hover:underline"
                  >
                    <ExternalLink size={16} /> Live
                  </a>
                )}
                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--color-accent-2)] hover:underline"
                  >
                    <PlayCircle size={16} /> Watch demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-white/70 hover:text-white"
                  >
                    <Github size={16} /> Code
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
