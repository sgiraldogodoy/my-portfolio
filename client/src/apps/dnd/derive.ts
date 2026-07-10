// Derived-stat math for 5e (2014). All numbers recomputed from the build so
// stored characters stay consistent if the rules data is corrected later.

import {
  ABILITIES,
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  SKILLS,
  STANDARD_ARRAY,
  backgroundById,
  classById,
  raceById,
  subraceById,
  type AbilityKey,
} from "./data/srd";
import type { AbilityScores, CharacterBuild } from "./types";

export const mod = (score: number) => Math.floor((score - 10) / 2);
export const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

export const proficiencyBonus = (level: number) => 2 + Math.floor((level - 1) / 4);

/** Base scores + fixed racial bonuses + chosen flexible bonuses. */
export function finalAbilities(build: CharacterBuild): AbilityScores {
  const race = raceById(build.raceId);
  const subrace = subraceById(race, build.subraceId);
  const out = { ...build.baseAbilities };
  for (const { key } of ABILITIES) {
    out[key] += race?.bonuses[key] ?? 0;
    out[key] += subrace?.bonuses[key] ?? 0;
    if (race?.bonusChoose && build.bonusChoices.includes(key)) {
      out[key] += race.bonusChoose.amount;
    }
  }
  return out;
}

export type SkillLine = {
  id: string;
  name: string;
  ability: AbilityKey;
  proficient: boolean;
  /** Where the proficiency came from, for the sheet UI. */
  source?: "class" | "background" | "race";
  bonus: number;
};

export type DerivedStats = {
  abilities: AbilityScores;
  mods: AbilityScores;
  prof: number;
  maxHp: number;
  ac: number;
  acLabel: string;
  initiative: number;
  speed: number;
  saves: { key: AbilityKey; proficient: boolean; bonus: number }[];
  skills: SkillLine[];
  passivePerception: number;
  languages: string[];
  extraLanguages: number;
  spell?: { ability: AbilityKey; saveDc: number; attack: number; active: boolean; note: string };
};

export function deriveStats(build: CharacterBuild): DerivedStats {
  const race = raceById(build.raceId);
  const cls = classById(build.classId);
  const bg = backgroundById(build.backgroundId);

  const abilities = finalAbilities(build);
  const mods = Object.fromEntries(
    ABILITIES.map(({ key }) => [key, mod(abilities[key])]),
  ) as AbilityScores;

  const level = build.level;
  const prof = proficiencyBonus(level);

  // HP: max hit die at level 1, average (rounded up) per level after.
  const hitDie = cls?.hitDie ?? 8;
  const hillDwarfBonus = build.subraceId === "hill-dwarf" ? level : 0;
  const maxHp = Math.max(
    1,
    hitDie + mods.con + (level - 1) * (hitDie / 2 + 1 + mods.con) + hillDwarfBonus,
  );

  // AC from the class's default loadout.
  const kit = cls?.armorKit ?? { label: "Unarmored", base: 10, dex: "full" as const, shield: false };
  let ac = kit.base;
  if (kit.unarmored === "barbarian") ac += mods.dex + mods.con;
  else if (kit.unarmored === "monk") ac += mods.dex + mods.wis;
  else if (kit.dex === "full") ac += mods.dex;
  else if (kit.dex === "max2") ac += Math.min(2, mods.dex);
  if (kit.shield) ac += 2;

  const saves = ABILITIES.map(({ key }) => {
    const proficient = cls?.saves.includes(key) ?? false;
    return { key, proficient, bonus: mods[key] + (proficient ? prof : 0) };
  });

  const classSet = new Set(build.classSkills);
  const bgSet = new Set(bg?.skills ?? []);
  const raceSet = new Set([...(race?.grantedSkills ?? []), ...build.raceSkills]);
  const skills: SkillLine[] = SKILLS.map((s) => {
    const source = classSet.has(s.id)
      ? ("class" as const)
      : bgSet.has(s.id)
        ? ("background" as const)
        : raceSet.has(s.id)
          ? ("race" as const)
          : undefined;
    return {
      id: s.id,
      name: s.name,
      ability: s.ability,
      proficient: !!source,
      source,
      bonus: mods[s.ability] + (source ? prof : 0),
    };
  });

  const perception = skills.find((s) => s.id === "perception")!;

  const languages = [...new Set(race?.languages ?? ["Common"])];
  const extraLanguages =
    (race?.extraLanguages ?? 0) +
    (bg?.extraLanguages ?? 0) +
    (build.subraceId === "high-elf" ? 1 : 0);

  const spell = cls?.spellcasting
    ? {
        ability: cls.spellcasting.ability,
        saveDc: 8 + prof + mods[cls.spellcasting.ability],
        attack: prof + mods[cls.spellcasting.ability],
        active: level >= cls.spellcasting.startLevel,
        note: cls.spellcasting.note,
      }
    : undefined;

  return {
    abilities,
    mods,
    prof,
    maxHp,
    ac,
    acLabel: kit.label,
    initiative: mods.dex,
    speed: race?.speed ?? 30,
    saves,
    skills,
    passivePerception: 10 + perception.bonus,
    languages,
    extraLanguages,
    spell,
  };
}

export function pointBuySpent(scores: AbilityScores) {
  return ABILITIES.reduce((sum, { key }) => sum + (POINT_BUY_COST[scores[key]] ?? 0), 0);
}

/** Validation for each wizard step; a build is saveable when all pass. */
export function buildProblems(build: CharacterBuild): string[] {
  const problems: string[] = [];
  const race = raceById(build.raceId);
  const cls = classById(build.classId);

  const values = ABILITIES.map(({ key }) => build.baseAbilities[key]);
  if (build.abilityMethod === "standard") {
    const wanted = [...STANDARD_ARRAY].sort((a, b) => a - b).join();
    if ([...values].sort((a, b) => a - b).join() !== wanted) {
      problems.push("Assign each standard array value (15, 14, 13, 12, 10, 8) exactly once.");
    }
  } else if (build.abilityMethod === "pointbuy") {
    const spent = pointBuySpent(build.baseAbilities);
    if (spent > POINT_BUY_BUDGET) problems.push(`Point buy exceeds ${POINT_BUY_BUDGET} points.`);
  }

  if (!cls) problems.push("Choose a class.");
  if (!race) problems.push("Choose a race.");
  if (race?.subraces?.length && !build.subraceId) problems.push("Choose a subrace.");
  if (race?.bonusChoose && build.bonusChoices.length !== race.bonusChoose.count) {
    problems.push(`Pick ${race.bonusChoose.count} abilities for your racial bonus.`);
  }
  if (cls && build.classSkills.length !== cls.skillChoose) {
    problems.push(`Pick ${cls.skillChoose} ${cls.name} skills.`);
  }
  if (race?.skillChoose && build.raceSkills.length !== race.skillChoose) {
    problems.push(`Pick ${race.skillChoose} skills for ${race.name} versatility.`);
  }
  if (!build.backgroundId) problems.push("Choose a background.");
  if (!build.name.trim()) problems.push("Give your character a name.");
  return problems;
}
