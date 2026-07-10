import { CLASSES, classById, skillById, ABILITY_NAME } from "../data/srd";
import type { CharacterBuild } from "../types";
import { OptionCard, Panel, PickChip } from "../ui";

export default function ClassStep({
  build,
  patch,
}: {
  build: CharacterBuild;
  patch: (p: Partial<CharacterBuild>) => void;
}) {
  const cls = classById(build.classId);

  function toggleSkill(id: string) {
    const has = build.classSkills.includes(id);
    if (has) {
      patch({ classSkills: build.classSkills.filter((s) => s !== id) });
    } else if (cls && build.classSkills.length < cls.skillChoose) {
      patch({ classSkills: [...build.classSkills, id] });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((c) => (
          <OptionCard
            key={c.id}
            selected={c.id === build.classId}
            onClick={() => patch({ classId: c.id, classSkills: [] })}
            title={c.name}
            subtitle={`d${c.hitDie}`}
          >
            <p className="mt-1 text-xs text-white/50">{c.blurb}</p>
          </OptionCard>
        ))}
      </div>

      {cls && (
        <Panel title={`${cls.name} details`}>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-white/40">Hit die:</span> d{cls.hitDie}
            </div>
            <div>
              <span className="text-white/40">Primary:</span>{" "}
              {cls.primary.map((a) => ABILITY_NAME[a]).join(" or ")}
            </div>
            <div>
              <span className="text-white/40">Saving throws:</span>{" "}
              {cls.saves.map((a) => ABILITY_NAME[a]).join(", ")}
            </div>
            <div>
              <span className="text-white/40">Armor:</span> {cls.armor}
            </div>
            <div className="sm:col-span-2">
              <span className="text-white/40">Weapons:</span> {cls.weapons}
            </div>
            {cls.tools && (
              <div className="sm:col-span-2">
                <span className="text-white/40">Tools:</span> {cls.tools}
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold">
              Skills — pick {cls.skillChoose}{" "}
              <span className="font-normal text-white/40">
                ({build.classSkills.length}/{cls.skillChoose} chosen)
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {cls.skillList.map((id) => (
                <PickChip
                  key={id}
                  selected={build.classSkills.includes(id)}
                  disabled={build.classSkills.length >= cls.skillChoose}
                  onClick={() => toggleSkill(id)}
                >
                  {skillById(id)?.name}
                </PickChip>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {cls.features.map((f) => (
              <p key={f.name} className="text-sm">
                <span className="font-semibold text-[var(--color-accent)]">{f.name}.</span>{" "}
                <span className="text-white/60">{f.desc}</span>
              </p>
            ))}
            {cls.spellcasting && (
              <p className="text-sm">
                <span className="font-semibold text-[var(--color-accent-2)]">Spellcasting.</span>{" "}
                <span className="text-white/60">{cls.spellcasting.note}</span>
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-white/40">
            Starting equipment: {cls.equipment.join(", ")}
          </p>
        </Panel>
      )}
    </div>
  );
}
