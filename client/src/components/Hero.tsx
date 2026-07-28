import { motion } from "framer-motion";
import { Download, Github, Linkedin } from "lucide-react";
import { profile } from "../data/content";

export default function Hero() {
  return (
    <section className="aurora relative flex min-h-screen items-center overflow-hidden px-6 pt-20">
      <div className="mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name}
          <span className="mt-3 block text-2xl font-semibold text-white/60 sm:text-3xl md:text-4xl">
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
    </section>
  );
}
