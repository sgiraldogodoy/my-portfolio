import { allTech } from "../../data/techStack";

// Split the flat list into rows that scroll in alternating directions.
const rows = [
  allTech.filter((_, i) => i % 3 === 0),
  allTech.filter((_, i) => i % 3 === 1),
  allTech.filter((_, i) => i % 3 === 2),
];

function Row({
  items,
  direction,
  duration,
}: {
  items: { name: string; category: string }[];
  direction: "left" | "right";
  duration: number;
}) {
  // Duplicate the items so the loop is seamless (-50% travels exactly one set).
  const doubled = [...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <div
        className="flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <span
            key={`${t.name}-${i}`}
            title={t.category}
            className="cursor-default whitespace-nowrap rounded-full border border-white/10 bg-[var(--color-surface)] px-4 py-2 text-sm text-white/80 transition hover:scale-105 hover:border-[var(--color-accent)] hover:text-white"
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeStack() {
  return (
    <div className="space-y-3">
      <Row items={rows[0]} direction="left" duration={32} />
      <Row items={rows[1]} direction="right" duration={38} />
      <Row items={rows[2]} direction="left" duration={28} />
      <p className="pt-2 text-center text-sm text-white/40">
        Hover any row to pause it. Hover a chip to see its category.
      </p>
    </div>
  );
}
