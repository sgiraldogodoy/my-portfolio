import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { techStack } from "../../data/techStack";

// One orbit ring per view. Home shows the categories orbiting "you"; clicking a
// category zooms in so its skills orbit that category. A back arrow returns home.

const RING_RADIUS = 34; // in cqw (percent of the square canvas width)
const SPIN_SECONDS = 90; // slow, calm rotation

const zoomVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 0.55 : 1.35 }),
  center: { opacity: 1, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 1.45 : 0.65 }),
};

function Orbit({
  centerLabel,
  centerBig,
  nodes,
  onNodeClick,
}: {
  centerLabel: string;
  centerBig?: boolean;
  nodes: string[];
  onNodeClick?: (name: string) => void;
}) {
  return (
    <div className="absolute inset-0" style={{ containerType: "size" }}>
      {/* faint orbit guide */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{ width: `${RING_RADIUS * 2}cqw`, height: `${RING_RADIUS * 2}cqw` }}
      />

      {/* center node */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-center font-bold text-white shadow-[0_0_45px_-4px_var(--color-accent)] ${
            centerBig ? "h-24 w-24 text-sm" : "h-20 w-20 px-2 text-xs"
          }`}
        >
          {centerLabel}
        </div>
      </div>

      {/* rotating ring of nodes */}
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ animation: `orbit-spin ${SPIN_SECONDS}s linear infinite` }}
      >
        {nodes.map((name, idx) => {
          const angle = (360 / nodes.length) * idx;
          return (
            <div
              key={name}
              className="absolute left-0 top-0"
              style={{
                transform: `rotate(${angle}deg) translateX(${RING_RADIUS}cqw) rotate(${-angle}deg)`,
              }}
            >
              {/* counter-rotate so labels stay upright */}
              <div style={{ animation: `orbit-spin-rev ${SPIN_SECONDS}s linear infinite` }}>
                <button
                  onClick={onNodeClick ? () => onNodeClick(name) : undefined}
                  className={`-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition ${
                    onNodeClick
                      ? "cursor-pointer border-[var(--color-accent)]/40 bg-[var(--color-surface)] text-white/90 hover:scale-110 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 hover:text-white"
                      : "border-white/10 bg-[var(--color-surface)] text-white/80"
                  }`}
                >
                  {name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GalaxyStack() {
  const [view, setView] = useState<string | null>(null); // null = home, else category key
  const [dir, setDir] = useState(1);

  const category = techStack.find((c) => c.key === view) ?? null;

  function openCategory(label: string) {
    const cat = techStack.find((c) => c.label === label);
    if (!cat) return;
    setDir(1);
    setView(cat.key);
  }

  function goHome() {
    setDir(-1);
    setView(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-square w-full max-w-[600px]">
        {/* back arrow (only when zoomed into a category) */}
        <AnimatePresence>
          {category && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={goHome}
              className="absolute left-0 top-0 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--color-surface)] px-3 py-1.5 text-sm text-white/80 transition hover:border-[var(--color-accent)] hover:text-white"
            >
              <ArrowLeft size={15} /> Back
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={view ?? "home"}
            custom={dir}
            variants={zoomVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {category ? (
              <Orbit centerLabel={category.label} nodes={category.items} />
            ) : (
              <Orbit
                centerLabel="Santiago"
                centerBig
                nodes={techStack.map((c) => c.label)}
                onNodeClick={openCategory}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="h-6 text-sm text-white/60">
        {category
          ? `${category.label}: ${category.items.length} skills in orbit`
          : "Tap a category to zoom into its skills."}
      </p>
    </div>
  );
}
