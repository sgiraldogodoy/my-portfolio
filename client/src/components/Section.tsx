import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

/** Shared section wrapper: anchor target, heading, and a fade-in-on-scroll. */
export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        <span className="text-[var(--color-accent)]">#</span> {title}
      </motion.h2>
      {children}
    </section>
  );
}
