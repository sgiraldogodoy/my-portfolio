import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TerminalStack from "../components/techstack/TerminalStack";
import GalaxyStack from "../components/techstack/GalaxyStack";
import ConstellationStack from "../components/techstack/ConstellationStack";
import MarqueeStack from "../components/techstack/MarqueeStack";

const options = [
  {
    n: 1,
    title: "Interactive Terminal",
    blurb: "Type or tap commands to reveal the stack.",
    el: <TerminalStack />,
  },
  {
    n: 2,
    title: "Orbiting Tech Galaxy",
    blurb: "Technologies orbit you in category rings. Tap one to inspect.",
    el: <GalaxyStack />,
  },
  {
    n: 3,
    title: "Filterable Constellation",
    blurb: "Filter by category; hover a tech to see which projects use it.",
    el: <ConstellationStack />,
  },
  {
    n: 4,
    title: "Animated Logo Marquee",
    blurb: "Scrolling rows of tech. Hover to pause.",
    el: <MarqueeStack />,
  },
];

export default function TechStackPreview() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back to site
        </Link>

        <h1 className="text-3xl font-bold sm:text-4xl">Tech stack showcase options</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Four ways to present the full stack. Play with each, then tell me the number
          you want and I'll wire it into the main page and remove the rest. This page is
          temporary and not linked from the live site.
        </p>

        <div className="mt-12 space-y-20">
          {options.map((o) => (
            <section key={o.n}>
              <div className="mb-6 border-l-2 border-[var(--color-accent)] pl-4">
                <h2 className="text-2xl font-semibold">
                  <span className="text-[var(--color-accent)]">Option {o.n}.</span>{" "}
                  {o.title}
                </h2>
                <p className="text-white/55">{o.blurb}</p>
              </div>
              {o.el}
            </section>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-white/10 bg-[var(--color-surface)] p-6 text-center text-white/70">
          Like one? Just say the option number (1, 2, 3, or 4) and I'll make it your
          real tech-stack section.
        </div>
      </div>
    </div>
  );
}
