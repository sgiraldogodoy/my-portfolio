import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import { profile } from "../data/content";

export default function Hero() {
  return (
    <section className="aurora relative flex min-h-screen items-center overflow-hidden px-6 pt-20">
      <div className="mx-auto max-w-6xl">
        {profile.available && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Available for freelance work
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name}
          <span className="block bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
            {profile.role}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-white/70"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold transition hover:bg-white/5"
          >
            <Download size={18} /> Resume
          </a>
          <div className="flex items-center gap-3 text-white/60">
            {profile.socials.github && (
              <a href={profile.socials.github} aria-label="GitHub" className="hover:text-white">
                <Github />
              </a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} aria-label="LinkedIn" className="hover:text-white">
                <Linkedin />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        aria-label="Scroll down"
      >
        <ArrowDown className="animate-bounce" />
      </a>
    </section>
  );
}
