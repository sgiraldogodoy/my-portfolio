import { ALIGNMENTS } from "../data/srd";
import type { CharacterBuild } from "../types";
import { Panel, inputClass } from "../ui";

export default function DetailsStep({
  build,
  patch,
}: {
  build: CharacterBuild;
  patch: (p: Partial<CharacterBuild>) => void;
}) {
  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-white/50">Character name</span>
          <input
            value={build.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="e.g. Thorin Emberbeard"
            maxLength={100}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-white/50">Level</span>
          <select
            value={build.level}
            onChange={(e) => patch({ level: Number(e.target.value) })}
            className={inputClass}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-white/50">Alignment</span>
          <select
            value={build.alignment}
            onChange={(e) => patch({ alignment: e.target.value })}
            className={inputClass}
          >
            {ALIGNMENTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-white/50">
            Notes — personality, ideals, bonds, flaws, backstory…
          </span>
          <textarea
            value={build.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            rows={6}
            maxLength={5000}
            className={inputClass}
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-white/40">
        Levels above 1 scale hit points (average per level), proficiency bonus, and spell DCs.
        Features shown on the sheet are the level-1 core features.
      </p>
    </Panel>
  );
}
