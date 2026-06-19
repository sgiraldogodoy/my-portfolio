import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { techStack } from "../../data/techStack";

// Drill-down galaxy. Home: categories (drawn as little orbits) circle "you".
// Click one to zoom in so its skills circle that category. Back arrow returns.
//
// Positions are computed every animation frame from one shared clock, so the
// nodes and the ring can never drift out of sync.

const RING_RADIUS = 33; // percent of the square canvas (distance from center)
const LOOP_MS = 95000; // one full revolution: slow and calm

type OrbitNode = { id: string; label: string };

function Orbit({
  centerLabel,
  centerBig,
  nodes,
  mini,
  onNodeClick,
}: {
  centerLabel: string;
  centerBig?: boolean;
  nodes: OrbitNode[];
  mini?: boolean; // draw nodes as little orbits (used for categories)
  onNodeClick?: (id: string) => void;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useAnimationFrame((t) => {
    const rot = (t / LOOP_MS) * Math.PI * 2;
    for (let i = 0; i < nodes.length; i++) {
      const el = refs.current[i];
      if (!el) continue;
      const a = rot + (i / nodes.length) * Math.PI * 2;
      el.style.left = `${50 + RING_RADIUS * Math.cos(a)}%`;
      el.style.top = `${50 + RING_RADIUS * Math.sin(a)}%`;
    }
  });

  return (
    <div className="absolute inset-0">
      {/* faint orbit guide */}
      {/*<div*/}
      {/*  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"*/}
      {/*  style={{ width: `${RING_RADIUS * 2}%`, height: `${RING_RADIUS * 2}%` }}*/}
      {/*/>*/}

      {/* center node */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] px-2 text-center font-bold leading-tight text-white shadow-[0_0_45px_-4px_var(--color-accent)] ${
            centerBig ? "text-sm" : "text-xs"
          }`}
        >
          {centerLabel}
        </div>
      </div>

      {/* orbiting nodes (positioned each frame via refs) */}
      {nodes.map((n, i) => (
        <div
          key={n.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: "50%", top: "50%" }}
        >
          {mini ? (
            <CategoryOrbitNode label={n.label} onClick={() => onNodeClick?.(n.id)} />
          ) : (
            <span className="block whitespace-nowrap rounded-full border border-white/10 bg-[var(--color-surface)] px-3 py-1.5 text-xs text-white/85">
              {n.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// A category rendered as its own tiny orbit: a center dot with a satellite circling it.
function CategoryOrbitNode({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)]/30 transition duration-300 group-hover:scale-110 group-hover:border-[var(--color-accent)]">
        {/* center dot */}
        <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]" />
        {/* satellite revolving around the dot */}
        <span
          className="absolute inset-0"
          style={{ animation: "orbit-spin 5s linear infinite" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-2)] shadow-[0_0_8px_var(--color-accent-2)]" />
        </span>
      </span>
      <span className="whitespace-nowrap text-xs text-white/85 transition group-hover:text-white">
        {label}
      </span>
    </button>
  );
}

const zoomVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 0.55 : 1.35 }),
  center: { opacity: 1, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 1.45 : 0.65 }),
};

export default function GalaxyStack() {
  const [view, setView] = useState<string | null>(null); // null = home, else category key
  const [dir, setDir] = useState(1);

  const category = techStack.find((c) => c.key === view) ?? null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-square w-full max-w-[600px]">
        {/* back arrow (only when zoomed in) */}
        <AnimatePresence>
          {category && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setDir(-1);
                setView(null);
              }}
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
              <Orbit
                centerLabel={category.label}
                nodes={category.items.map((s) => ({ id: s, label: s }))}
              />
            ) : (
              <Orbit
                centerLabel="Santiago"
                centerBig
                mini
                nodes={techStack.map((c) => ({ id: c.key, label: c.label }))}
                onNodeClick={(id) => {
                  setDir(1);
                  setView(id);
                }}
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
