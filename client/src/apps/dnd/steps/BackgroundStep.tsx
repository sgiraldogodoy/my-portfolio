import { BACKGROUNDS, backgroundById, skillById } from "../data/srd";
import type { CharacterBuild } from "../types";
import { OptionCard, Panel } from "../ui";

export default function BackgroundStep({
  build,
  patch,
}: {
  build: CharacterBuild;
  patch: (p: Partial<CharacterBuild>) => void;
}) {
  const bg = backgroundById(build.backgroundId);
  const overlap = bg?.skills.filter((s) => build.classSkills.includes(s)) ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BACKGROUNDS.map((b) => (
          <OptionCard
            key={b.id}
            selected={b.id === build.backgroundId}
            onClick={() => patch({ backgroundId: b.id })}
            title={b.name}
            subtitle={b.skills.map((s) => skillById(s)?.name).join(" · ")}
          >
            <p className="mt-1 text-xs text-white/50">{b.blurb}</p>
          </OptionCard>
        ))}
      </div>

      {bg && (
        <Panel title={`${bg.name} details`}>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-white/40">Skill proficiencies:</span>{" "}
              {bg.skills.map((s) => skillById(s)?.name).join(", ")}
            </p>
            {bg.tools && (
              <p>
                <span className="text-white/40">Tools:</span> {bg.tools}
              </p>
            )}
            {bg.extraLanguages ? (
              <p>
                <span className="text-white/40">Languages:</span> {bg.extraLanguages} of your choice
              </p>
            ) : null}
            <p>
              <span className="font-semibold text-[var(--color-accent)]">{bg.feature.name}.</span>{" "}
              <span className="text-white/60">{bg.feature.desc}</span>
            </p>
          </div>

          {overlap.length > 0 && (
            <p className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200/80">
              You already chose {overlap.map((s) => skillById(s)?.name).join(" and ")} from your
              class. In 5e you'd normally pick a different class skill instead — consider swapping
              in the Class step.
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
