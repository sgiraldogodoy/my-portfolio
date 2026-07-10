import type { AbilityKey } from "./data/srd";

export type AbilityMethod = "standard" | "pointbuy" | "roll";

export type AbilityScores = Record<AbilityKey, number>;

/**
 * Everything the player chose in the builder. Derived stats (modifiers, HP,
 * AC, saves…) are always recomputed from this, never stored.
 */
export type CharacterBuild = {
  name: string;
  classId: string;
  raceId: string;
  subraceId?: string;
  backgroundId: string;
  level: number;
  alignment: string;
  abilityMethod: AbilityMethod;
  /** Base scores before racial bonuses. */
  baseAbilities: AbilityScores;
  /** Abilities picked for a race's flexible bonus (Half-Elf: two +1s). */
  bonusChoices: AbilityKey[];
  /** Skill proficiencies chosen from the class list. */
  classSkills: string[];
  /** Extra skills from race (Half-Elf Skill Versatility). */
  raceSkills: string[];
  notes: string;
};

export type StoredCharacter = {
  id: string;
  build: CharacterBuild;
  updatedAt: string;
};

export const DEFAULT_ABILITIES: AbilityScores = {
  str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8,
};

export function emptyBuild(): CharacterBuild {
  return {
    name: "",
    classId: "",
    raceId: "",
    subraceId: undefined,
    backgroundId: "",
    level: 1,
    alignment: "True Neutral",
    abilityMethod: "standard",
    baseAbilities: { ...DEFAULT_ABILITIES },
    bonusChoices: [],
    classSkills: [],
    raceSkills: [],
    notes: "",
  };
}
