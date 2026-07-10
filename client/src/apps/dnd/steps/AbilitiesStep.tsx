import { Dices, Minus, Plus } from "lucide-react";
import {
  ABILITIES,
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  STANDARD_ARRAY,
  raceById,
  subraceById,
  type AbilityKey,
} from "../data/srd";
import { fmt, mod, pointBuySpent } from "../derive";
import type { AbilityMethod, CharacterBuild } from "../types";
import { DEFAULT_ABILITIES } from "../types";
import { Panel } from "../ui";

function roll4d6DropLowest() {
  const dice = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
  dice.sort((a, b) => a - b);
  return dice[1] + dice[2] + dice[3];
}

const METHODS: { id: AbilityMethod; label: string; hint: string }[] = [
  { id: "standard", label: "Standard Array", hint: "Assign 15, 14, 13, 12, 10, 8" },
  { id: "pointbuy", label: "Point Buy", hint: "27 points, scores 8–15" },
  { id: "roll", label: "Roll", hint: "4d6, drop the lowest" },
];

export default function AbilitiesStep({
  build,
  patch,
}: {
  build: CharacterBuild;
  patch: (p: Partial<CharacterBuild>) => void;
}) {
  const race = raceById(build.raceId);
  const subrace = subraceById(race, build.subraceId);

  function setMethod(method: AbilityMethod) {
    if (method === build.abilityMethod) return;
    patch({ abilityMethod: method, baseAbilities: { ...DEFAULT_ABILITIES } });
  }

  function setScore(key: AbilityKey, value: number) {
    patch({ baseAbilities: { ...build.baseAbilities, [key]: value } });
  }

  const scores = build.baseAbilities;
  const spent = pointBuySpent(scores);

  function racialBonus(key: AbilityKey) {
    let b = (race?.bonuses[key] ?? 0) + (subrace?.bonuses[key] ?? 0);
    if (race?.bonusChoose && build.bonusChoices.includes(key)) b += race.bonusChoose.amount;
    return b;
  }

  // Standard array: values still available for a given ability's dropdown.
  function arrayOptions(key: AbilityKey) {
    const usedElsewhere = ABILITIES.filter(({ key: k }) => k !== key).map(({ key: k }) => scores[k]);
    const pool = [...STANDARD_ARRAY];
    for (const v of usedElsewhere) {
      const i = pool.indexOf(v);
      if (i !== -1) pool.splice(i, 1);
    }
    return pool;
  }

  const standardComplete =
    [...STANDARD_ARRAY].sort().join() ===
    ABILITIES.map(({ key }) => scores[key]).sort().join();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`rounded-xl border px-4 py-2 text-left transition ${
              build.abilityMethod === m.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <span className="block text-sm font-semibold">{m.label}</span>
            <span className="block text-xs text-white/40">{m.hint}</span>
          </button>
        ))}
      </div>

      {build.abilityMethod === "pointbuy" && (
        <p className={`text-sm ${spent > POINT_BUY_BUDGET ? "text-red-400" : "text-white/60"}`}>
          Points spent: <span className="font-semibold">{spent}</span> / {POINT_BUY_BUDGET}
        </p>
      )}
      {build.abilityMethod === "standard" && !standardComplete && (
        <p className="text-sm text-white/60">Assign each value of the array exactly once.</p>
      )}
      {build.abilityMethod === "roll" && (
        <button
          type="button"
          onClick={() => {
            const next = { ...scores };
            for (const { key } of ABILITIES) next[key] = roll4d6DropLowest();
            patch({ baseAbilities: next });
          }}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Dices size={16} /> Roll all six
        </button>
      )}

      <Panel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ABILITIES.map(({ key, name }) => {
            const bonus = racialBonus(key);
            const total = scores[key] + bonus;
            return (
              <div key={key} className="rounded-xl border border-white/10 bg-[var(--color-bg)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{name}</span>
                  <span className="text-xs text-white/40">
                    {bonus > 0 && `race +${bonus} → `}
                    <span className="text-white/70">{total}</span> ({fmt(mod(total))})
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {build.abilityMethod === "standard" && (
                    <select
                      value={scores[key]}
                      onChange={(e) => setScore(key, Number(e.target.value))}
                      className="w-full rounded-lg border border-white/10 bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                    >
                      {!STANDARD_ARRAY.includes(scores[key]) && <option value={scores[key]}>—</option>}
                      {arrayOptions(key).map((v, i) => (
                        <option key={`${v}-${i}`} value={v}>
                          {v}
                        </option>
                      ))}
                      {STANDARD_ARRAY.includes(scores[key]) && !arrayOptions(key).includes(scores[key]) && (
                        <option value={scores[key]}>{scores[key]}</option>
                      )}
                    </select>
                  )}

                  {build.abilityMethod === "pointbuy" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setScore(key, Math.max(POINT_BUY_MIN, scores[key] - 1))}
                        className="rounded-lg border border-white/10 p-2 hover:border-white/40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold">{scores[key]}</span>
                      <button
                        type="button"
                        disabled={
                          scores[key] >= POINT_BUY_MAX ||
                          spent + (POINT_BUY_COST[scores[key] + 1] - POINT_BUY_COST[scores[key]]) >
                            POINT_BUY_BUDGET
                        }
                        onClick={() => setScore(key, Math.min(POINT_BUY_MAX, scores[key] + 1))}
                        className="rounded-lg border border-white/10 p-2 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="ml-auto text-xs text-white/40">
                        cost {POINT_BUY_COST[scores[key]]}
                      </span>
                    </>
                  )}

                  {build.abilityMethod === "roll" && (
                    <>
                      <input
                        type="number"
                        min={3}
                        max={18}
                        value={scores[key]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isInteger(v)) setScore(key, Math.max(3, Math.min(18, v)));
                        }}
                        className="w-20 rounded-lg border border-white/10 bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                      />
                      <button
                        type="button"
                        onClick={() => setScore(key, roll4d6DropLowest())}
                        title="Roll 4d6, drop lowest"
                        className="rounded-lg border border-white/10 p-2 hover:border-white/40"
                      >
                        <Dices size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
