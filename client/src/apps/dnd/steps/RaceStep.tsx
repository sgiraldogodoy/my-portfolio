import { ABILITIES, ABILITY_NAME, RACES, raceById, skillById, subraceById, ALL_SKILL_IDS } from "../data/srd";
import type { CharacterBuild } from "../types";
import { OptionCard, Panel, PickChip } from "../ui";
import type { AbilityKey } from "../data/srd";

function bonusLabel(bonuses: Partial<Record<AbilityKey, number>>) {
  const parts = Object.entries(bonuses).map(([k, v]) => `${ABILITY_NAME[k as AbilityKey].slice(0, 3).toUpperCase()} +${v}`);
  return parts.length === 6 ? "All +1" : parts.join(", ");
}

export default function RaceStep({
  build,
  patch,
}: {
  build: CharacterBuild;
  patch: (p: Partial<CharacterBuild>) => void;
}) {
  const race = raceById(build.raceId);
  const subrace = subraceById(race, build.subraceId);

  function selectRace(id: string) {
    const next = raceById(id);
    patch({
      raceId: id,
      // Auto-pick the only subrace when there is exactly one (SRD races have 0 or 1).
      subraceId: next?.subraces?.length === 1 ? next.subraces[0].id : undefined,
      bonusChoices: [],
      raceSkills: [],
    });
  }

  function toggleBonus(key: AbilityKey) {
    if (!race?.bonusChoose) return;
    const has = build.bonusChoices.includes(key);
    if (has) patch({ bonusChoices: build.bonusChoices.filter((k) => k !== key) });
    else if (build.bonusChoices.length < race.bonusChoose.count) {
      patch({ bonusChoices: [...build.bonusChoices, key] });
    }
  }

  function toggleRaceSkill(id: string) {
    if (!race?.skillChoose) return;
    const has = build.raceSkills.includes(id);
    if (has) patch({ raceSkills: build.raceSkills.filter((s) => s !== id) });
    else if (build.raceSkills.length < race.skillChoose) {
      patch({ raceSkills: [...build.raceSkills, id] });
    }
  }

  // Skills already granted elsewhere can't be picked again for Skill Versatility.
  const takenSkills = new Set([...build.classSkills, ...(race?.grantedSkills ?? [])]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RACES.map((r) => (
          <OptionCard
            key={r.id}
            selected={r.id === build.raceId}
            onClick={() => selectRace(r.id)}
            title={r.name}
            subtitle={bonusLabel(r.bonuses)}
          >
            <p className="mt-1 text-xs text-white/50">{r.blurb}</p>
          </OptionCard>
        ))}
      </div>

      {race && (
        <Panel title={`${race.name} details`}>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <span className="text-white/40">Speed:</span> {race.speed} ft.
            </div>
            <div>
              <span className="text-white/40">Size:</span> {race.size}
            </div>
            <div>
              <span className="text-white/40">Languages:</span> {race.languages.join(", ")}
              {race.extraLanguages ? ` +${race.extraLanguages} of your choice` : ""}
            </div>
          </div>

          {race.subraces && race.subraces.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Subrace</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {race.subraces.map((s) => (
                  <PickChip
                    key={s.id}
                    selected={build.subraceId === s.id}
                    onClick={() => patch({ subraceId: s.id })}
                  >
                    {s.name} ({bonusLabel(s.bonuses)})
                  </PickChip>
                ))}
              </div>
            </div>
          )}

          {race.bonusChoose && (
            <div className="mt-4">
              <p className="text-sm font-semibold">
                Choose {race.bonusChoose.count} abilities to increase by {race.bonusChoose.amount}{" "}
                <span className="font-normal text-white/40">
                  ({build.bonusChoices.length}/{race.bonusChoose.count})
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ABILITIES.filter(({ key }) => !race.bonuses[key]).map(({ key, name }) => (
                  <PickChip
                    key={key}
                    selected={build.bonusChoices.includes(key)}
                    disabled={build.bonusChoices.length >= race.bonusChoose!.count}
                    onClick={() => toggleBonus(key)}
                  >
                    {name} +{race.bonusChoose!.amount}
                  </PickChip>
                ))}
              </div>
            </div>
          )}

          {race.skillChoose && (
            <div className="mt-4">
              <p className="text-sm font-semibold">
                Skill Versatility — pick {race.skillChoose} skills{" "}
                <span className="font-normal text-white/40">
                  ({build.raceSkills.length}/{race.skillChoose})
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_SKILL_IDS.filter((id) => !takenSkills.has(id)).map((id) => (
                  <PickChip
                    key={id}
                    selected={build.raceSkills.includes(id)}
                    disabled={build.raceSkills.length >= race.skillChoose!}
                    onClick={() => toggleRaceSkill(id)}
                  >
                    {skillById(id)?.name}
                  </PickChip>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {[...race.traits, ...(subrace?.traits ?? [])].map((t) => (
              <p key={t.name} className="text-sm">
                <span className="font-semibold text-[var(--color-accent)]">{t.name}.</span>{" "}
                <span className="text-white/60">{t.desc}</span>
              </p>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
