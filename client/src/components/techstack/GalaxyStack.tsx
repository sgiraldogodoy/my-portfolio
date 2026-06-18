import { useState } from "react";
import { techStack } from "../../data/techStack";

// Each category becomes an orbit ring. Radii grow outward; speeds/directions vary.
const rings = techStack.map((cat, i) => ({
  ...cat,
  radius: 90 + i * 58,
  duration: 26 + i * 8,
  reverse: i % 2 === 1,
}));

const SIZE = 640; // square canvas in px (scaled down responsively)
const CENTER = SIZE / 2;

export default function GalaxyStack() {
  const [selected, setSelected] = useState<{ name: string; category: string } | null>(
    null,
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative aspect-square w-full max-w-[640px]"
        style={{ ["--size" as string]: `${SIZE}px` }}
      >
        <div className="absolute inset-0" style={{ containerType: "size" }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
            {/* faint orbit guides */}
            {rings.map((r) => (
              <circle
                key={r.key}
                cx={CENTER}
                cy={CENTER}
                r={r.radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
          </svg>

          {/* center node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-center text-xs font-bold text-white shadow-[0_0_40px_-4px_var(--color-accent)]">
              Santiago
            </div>
          </div>

          {/* rings */}
          {rings.map((ring) => {
            const pctR = (ring.radius / SIZE) * 100;
            return (
              <div
                key={ring.key}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{
                  animation: `${ring.reverse ? "orbit-spin-rev" : "orbit-spin"} ${ring.duration}s linear infinite`,
                }}
              >
                {ring.items.map((name, idx) => {
                  const angle = (360 / ring.items.length) * idx;
                  return (
                    <div
                      key={name}
                      className="absolute left-0 top-0"
                      style={{
                        transform: `rotate(${angle}deg) translateX(${pctR}cqw) rotate(${-angle}deg)`,
                      }}
                    >
                      {/* counter-rotate so labels stay upright as the ring spins */}
                      <div
                        style={{
                          animation: `${ring.reverse ? "orbit-spin" : "orbit-spin-rev"} ${ring.duration}s linear infinite`,
                        }}
                      >
                        <button
                          onClick={() => setSelected({ name, category: ring.label })}
                          className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-white/80 transition hover:scale-110 hover:border-[var(--color-accent)] hover:text-white"
                        >
                          {name}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="h-6 text-sm text-white/60">
        {selected ? (
          <>
            <span className="font-semibold text-white">{selected.name}</span>{" "}
            <span className="text-white/40">in {selected.category}</span>
          </>
        ) : (
          "Tap a technology to inspect it."
        )}
      </p>
    </div>
  );
}
