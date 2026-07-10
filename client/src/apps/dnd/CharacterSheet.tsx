import {
  ABILITIES,
  ABILITY_NAME,
  backgroundById,
  classById,
  raceById,
  subraceById,
} from "./data/srd";
import { deriveStats, fmt } from "./derive";
import type { CharacterBuild } from "./types";
import { Panel, StatBox } from "./ui";

const SOURCE_LABEL = { class: "class", background: "background", race: "race" } as const;

export default function CharacterSheet({ build }: { build: CharacterBuild }) {
  const race = raceById(build.raceId);
  const subrace = subraceById(race, build.subraceId);
  const cls = classById(build.classId);
  const bg = backgroundById(build.backgroundId);
  const d = deriveStats(build);

  const traits = [...(race?.traits ?? []), ...(subrace?.traits ?? [])];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Panel>
        <h2 className="text-xl font-bold">{build.name || "Unnamed adventurer"}</h2>
        <p className="mt-0.5 text-sm text-white/50">
          {subrace?.name ?? race?.name ?? "—"} {cls?.name ?? "—"} {build.level} ·{" "}
          {bg?.name ?? "—"} · {build.alignment}
        </p>
      </Panel>

      {/* Ability scores */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ABILITIES.map(({ key, short }) => (
          <StatBox
            key={key}
            label={short}
            value={
              <>
                {fmt(d.mods[key])}
                <span className="ml-1 text-xs font-normal text-white/40">{d.abilities[key]}</span>
              </>
            }
            hint={ABILITY_NAME[key]}
          />
        ))}
      </div>

      {/* Combat stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <StatBox label="Armor Class" value={d.ac} hint={d.acLabel} />
        <StatBox label="Hit Points" value={d.maxHp} hint={`d${cls?.hitDie ?? "?"} hit die`} />
        <StatBox label="Initiative" value={fmt(d.initiative)} />
        <StatBox label="Speed" value={`${d.speed} ft`} />
        <StatBox label="Proficiency" value={fmt(d.prof)} />
        <StatBox label="Passive Perc." value={d.passivePerception} />
      </div>
      <p className="text-xs text-white/40">AC assumes {d.acLabel.toLowerCase()} (default {cls?.name ?? ""} loadout).</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Saving throws + skills */}
        <Panel title="Saving throws">
          <ul className="grid grid-cols-2 gap-1.5 text-sm">
            {d.saves.map((s) => (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    s.proficient ? "bg-[var(--color-accent)]" : "bg-white/15"
                  }`}
                />
                <span className="w-8 font-mono text-white/70">{fmt(s.bonus)}</span>
                <span className={s.proficient ? "" : "text-white/50"}>{ABILITY_NAME[s.key]}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Skills">
          <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
            {d.skills.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    s.proficient ? "bg-[var(--color-accent)]" : "bg-white/15"
                  }`}
                />
                <span className="w-8 font-mono text-white/70">{fmt(s.bonus)}</span>
                <span className={s.proficient ? "" : "text-white/50"}>{s.name}</span>
                {s.source && (
                  <span className="text-[10px] text-white/30">({SOURCE_LABEL[s.source]})</span>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Spellcasting */}
      {d.spell && (
        <Panel title="Spellcasting">
          {d.spell.active ? (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>
                <span className="text-white/40">Ability:</span> {ABILITY_NAME[d.spell.ability]}
              </span>
              <span>
                <span className="text-white/40">Spell save DC:</span> {d.spell.saveDc}
              </span>
              <span>
                <span className="text-white/40">Spell attack:</span> {fmt(d.spell.attack)}
              </span>
            </div>
          ) : null}
          <p className={`text-sm text-white/60 ${d.spell.active ? "mt-2" : ""}`}>{d.spell.note}</p>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Features */}
        <Panel title={`${cls?.name ?? "Class"} features (level 1)`}>
          <div className="space-y-2">
            {(cls?.features ?? []).map((f) => (
              <p key={f.name} className="text-sm">
                <span className="font-semibold text-[var(--color-accent)]">{f.name}.</span>{" "}
                <span className="text-white/60">{f.desc}</span>
              </p>
            ))}
            {bg && (
              <p className="text-sm">
                <span className="font-semibold text-[var(--color-accent-2)]">
                  {bg.feature.name} ({bg.name}).
                </span>{" "}
                <span className="text-white/60">{bg.feature.desc}</span>
              </p>
            )}
          </div>
        </Panel>

        {/* Racial traits */}
        <Panel title={`${race?.name ?? "Racial"} traits`}>
          <div className="space-y-2">
            {traits.map((t) => (
              <p key={t.name} className="text-sm">
                <span className="font-semibold text-[var(--color-accent)]">{t.name}.</span>{" "}
                <span className="text-white/60">{t.desc}</span>
              </p>
            ))}
            {traits.length === 0 && <p className="text-sm text-white/40">—</p>}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Proficiencies & languages">
          <div className="space-y-1.5 text-sm text-white/60">
            <p>
              <span className="text-white/40">Armor:</span> {cls?.armor ?? "—"}
            </p>
            <p>
              <span className="text-white/40">Weapons:</span> {cls?.weapons ?? "—"}
            </p>
            {(cls?.tools || bg?.tools) && (
              <p>
                <span className="text-white/40">Tools:</span>{" "}
                {[cls?.tools, bg?.tools].filter(Boolean).join("; ")}
              </p>
            )}
            <p>
              <span className="text-white/40">Languages:</span> {d.languages.join(", ")}
              {d.extraLanguages > 0 && ` + ${d.extraLanguages} of your choice`}
            </p>
          </div>
        </Panel>

        <Panel title="Equipment">
          <ul className="list-inside list-disc space-y-1 text-sm text-white/60">
            {(cls?.equipment ?? []).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Panel>
      </div>

      {build.notes.trim() && (
        <Panel title="Notes">
          <p className="whitespace-pre-wrap text-sm text-white/60">{build.notes}</p>
        </Panel>
      )}
    </div>
  );
}
