// D&D 5e (2014) rules data, sourced from the SRD 5.1 (CC-BY-4.0) and verified
// against dnd5eapi.co and the D&D Beyond Basic Rules. Descriptions are concise
// paraphrases meant for the builder UI, not full rules text.

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export const ABILITIES: { key: AbilityKey; name: string; short: string }[] = [
  { key: "str", name: "Strength", short: "STR" },
  { key: "dex", name: "Dexterity", short: "DEX" },
  { key: "con", name: "Constitution", short: "CON" },
  { key: "int", name: "Intelligence", short: "INT" },
  { key: "wis", name: "Wisdom", short: "WIS" },
  { key: "cha", name: "Charisma", short: "CHA" },
];

export const ABILITY_NAME: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

// --- Skills ---------------------------------------------------------------------

export type Skill = { id: string; name: string; ability: AbilityKey };

export const SKILLS: Skill[] = [
  { id: "acrobatics", name: "Acrobatics", ability: "dex" },
  { id: "animal-handling", name: "Animal Handling", ability: "wis" },
  { id: "arcana", name: "Arcana", ability: "int" },
  { id: "athletics", name: "Athletics", ability: "str" },
  { id: "deception", name: "Deception", ability: "cha" },
  { id: "history", name: "History", ability: "int" },
  { id: "insight", name: "Insight", ability: "wis" },
  { id: "intimidation", name: "Intimidation", ability: "cha" },
  { id: "investigation", name: "Investigation", ability: "int" },
  { id: "medicine", name: "Medicine", ability: "wis" },
  { id: "nature", name: "Nature", ability: "int" },
  { id: "perception", name: "Perception", ability: "wis" },
  { id: "performance", name: "Performance", ability: "cha" },
  { id: "persuasion", name: "Persuasion", ability: "cha" },
  { id: "religion", name: "Religion", ability: "int" },
  { id: "sleight-of-hand", name: "Sleight of Hand", ability: "dex" },
  { id: "stealth", name: "Stealth", ability: "dex" },
  { id: "survival", name: "Survival", ability: "wis" },
];

export const ALL_SKILL_IDS = SKILLS.map((s) => s.id);

// --- Races ------------------------------------------------------------------------

export type Trait = { name: string; desc: string };

export type Subrace = {
  id: string;
  name: string;
  bonuses: Partial<Record<AbilityKey, number>>;
  traits: Trait[];
};

export type Race = {
  id: string;
  name: string;
  blurb: string;
  speed: number;
  size: "Small" | "Medium";
  bonuses: Partial<Record<AbilityKey, number>>;
  /** e.g. Half-Elf: choose `count` different abilities to raise by `amount`. */
  bonusChoose?: { count: number; amount: number };
  languages: string[];
  extraLanguages?: number;
  traits: Trait[];
  /** Skill proficiencies always granted (Elf Keen Senses, Half-Orc Menacing). */
  grantedSkills?: string[];
  /** Half-Elf Skill Versatility: choose this many skills of your choice. */
  skillChoose?: number;
  subraces?: Subrace[];
};

export const RACES: Race[] = [
  {
    id: "dwarf",
    name: "Dwarf",
    blurb: "Stout, hardy folk of mountain and hill, slow to trust and hard to kill.",
    speed: 25,
    size: "Medium",
    bonuses: { con: 2 },
    languages: ["Common", "Dwarvish"],
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Dwarven Resilience", desc: "Advantage on saves vs. poison; resistance to poison damage." },
      { name: "Dwarven Combat Training", desc: "Proficiency with battleaxe, handaxe, light hammer, and warhammer." },
      { name: "Tool Proficiency", desc: "Proficiency with one artisan's tools: smith's, brewer's, or mason's tools." },
      { name: "Stonecunning", desc: "Double proficiency on History checks about stonework." },
      { name: "Speed", desc: "Speed is not reduced by wearing heavy armor." },
    ],
    subraces: [
      {
        id: "hill-dwarf",
        name: "Hill Dwarf",
        bonuses: { wis: 1 },
        traits: [{ name: "Dwarven Toughness", desc: "Hit point maximum increases by 1 per level." }],
      },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    blurb: "Graceful, long-lived people of otherworldly beauty attuned to magic and nature.",
    speed: 30,
    size: "Medium",
    bonuses: { dex: 2 },
    languages: ["Common", "Elvish"],
    grantedSkills: ["perception"],
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Keen Senses", desc: "Proficiency in the Perception skill." },
      { name: "Fey Ancestry", desc: "Advantage on saves vs. being charmed; magic can't put you to sleep." },
      { name: "Trance", desc: "Elves don't sleep; they meditate 4 hours a day instead." },
    ],
    subraces: [
      {
        id: "high-elf",
        name: "High Elf",
        bonuses: { int: 1 },
        traits: [
          { name: "Elf Weapon Training", desc: "Proficiency with longsword, shortsword, shortbow, and longbow." },
          { name: "Cantrip", desc: "Know one cantrip of your choice from the wizard spell list (INT)." },
          { name: "Extra Language", desc: "Speak, read, and write one extra language of your choice." },
        ],
      },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    blurb: "Small, cheerful, and practical folk with a knack for slipping out of danger.",
    speed: 25,
    size: "Small",
    bonuses: { dex: 2 },
    languages: ["Common", "Halfling"],
    traits: [
      { name: "Lucky", desc: "Reroll 1s on attack rolls, ability checks, and saving throws." },
      { name: "Brave", desc: "Advantage on saving throws against being frightened." },
      { name: "Halfling Nimbleness", desc: "Move through the space of any creature larger than you." },
    ],
    subraces: [
      {
        id: "lightfoot",
        name: "Lightfoot Halfling",
        bonuses: { cha: 1 },
        traits: [{ name: "Naturally Stealthy", desc: "Hide even when obscured only by a creature one size larger." }],
      },
    ],
  },
  {
    id: "human",
    name: "Human",
    blurb: "Ambitious and adaptable, humans are the most widespread of all peoples.",
    speed: 30,
    size: "Medium",
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    languages: ["Common"],
    extraLanguages: 1,
    traits: [{ name: "Versatile", desc: "+1 to all six ability scores and one extra language." }],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    blurb: "Proud draconic humanoids whose blood carries the power of dragons.",
    speed: 30,
    size: "Medium",
    bonuses: { str: 2, cha: 1 },
    languages: ["Common", "Draconic"],
    traits: [
      { name: "Draconic Ancestry", desc: "Choose a dragon type; it sets your breath weapon and resistance (e.g. red = fire)." },
      { name: "Breath Weapon", desc: "Exhale destructive energy: 2d6 damage (DEX or CON save, half on success), once per rest." },
      { name: "Damage Resistance", desc: "Resistance to the damage type of your draconic ancestry." },
    ],
  },
  {
    id: "gnome",
    name: "Gnome",
    blurb: "Small, inventive, and irrepressibly curious tinkerers and tricksters.",
    speed: 25,
    size: "Small",
    bonuses: { int: 2 },
    languages: ["Common", "Gnomish"],
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Gnome Cunning", desc: "Advantage on INT, WIS, and CHA saves against magic." },
    ],
    subraces: [
      {
        id: "rock-gnome",
        name: "Rock Gnome",
        bonuses: { con: 1 },
        traits: [
          { name: "Artificer's Lore", desc: "Double proficiency on History checks about magical or mechanical devices." },
          { name: "Tinker", desc: "Proficiency with tinker's tools; build tiny clockwork devices." },
        ],
      },
    ],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    blurb: "Walkers of two worlds, combining elven grace with human ambition.",
    speed: 30,
    size: "Medium",
    bonuses: { cha: 2 },
    bonusChoose: { count: 2, amount: 1 },
    languages: ["Common", "Elvish"],
    extraLanguages: 1,
    skillChoose: 2,
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Fey Ancestry", desc: "Advantage on saves vs. being charmed; magic can't put you to sleep." },
      { name: "Skill Versatility", desc: "Proficiency in two skills of your choice." },
    ],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    blurb: "Fierce and driven, carrying orcish strength tempered by human resolve.",
    speed: 30,
    size: "Medium",
    bonuses: { str: 2, con: 1 },
    languages: ["Common", "Orc"],
    grantedSkills: ["intimidation"],
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Menacing", desc: "Proficiency in the Intimidation skill." },
      { name: "Relentless Endurance", desc: "Drop to 1 HP instead of 0 once per long rest." },
      { name: "Savage Attacks", desc: "On a melee weapon crit, roll one extra weapon damage die." },
    ],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    blurb: "Bearers of an infernal bloodline, met with stares and whispers everywhere.",
    speed: 30,
    size: "Medium",
    bonuses: { cha: 2, int: 1 },
    languages: ["Common", "Infernal"],
    traits: [
      { name: "Darkvision", desc: "See in dim light within 60 ft. as if it were bright light." },
      { name: "Hellish Resistance", desc: "Resistance to fire damage." },
      { name: "Infernal Legacy", desc: "Know the thaumaturgy cantrip; hellish rebuke at 3rd level, darkness at 5th (CHA)." },
    ],
  },
];

// --- Classes ------------------------------------------------------------------------

export type ArmorKit = {
  /** Human-readable default armor loadout, e.g. "Chain mail & shield". */
  label: string;
  base: number;
  /** How much DEX applies: "full", capped at 2, or none. */
  dex: "full" | "max2" | "none";
  shield: boolean;
  /** Unarmored Defense replaces armor entirely. */
  unarmored?: "barbarian" | "monk";
};

export type Spellcasting = {
  ability: AbilityKey;
  /** Class level at which spellcasting begins (Paladin/Ranger start at 2). */
  startLevel: 1 | 2;
  cantrips: number;
  /** Spells known at level 1, or "prepared" (ability mod + level). */
  known: number | "prepared" | "spellbook";
  slots: number;
  note: string;
};

export type ClassDef = {
  id: string;
  name: string;
  blurb: string;
  hitDie: number;
  primary: AbilityKey[];
  saves: AbilityKey[];
  skillChoose: number;
  skillList: string[];
  armor: string;
  weapons: string;
  tools?: string;
  armorKit: ArmorKit;
  spellcasting?: Spellcasting;
  features: Trait[];
  equipment: string[];
};

export const CLASSES: ClassDef[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    blurb: "A fierce warrior who channels primal fury into devastating attacks.",
    hitDie: 12,
    primary: ["str"],
    saves: ["str", "con"],
    skillChoose: 2,
    skillList: ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"],
    armor: "Light & medium armor, shields",
    weapons: "Simple & martial weapons",
    armorKit: { label: "Unarmored Defense", base: 10, dex: "full", shield: false, unarmored: "barbarian" },
    features: [
      { name: "Rage", desc: "2/long rest: advantage on STR checks/saves, +2 melee damage, resist bludgeoning/piercing/slashing." },
      { name: "Unarmored Defense", desc: "Without armor, AC = 10 + DEX modifier + CON modifier." },
    ],
    equipment: ["Greataxe", "Two handaxes", "Explorer's pack", "Four javelins"],
  },
  {
    id: "bard",
    name: "Bard",
    blurb: "An inspiring magician whose music and words weave magic and rally allies.",
    hitDie: 8,
    primary: ["cha"],
    saves: ["dex", "cha"],
    skillChoose: 3,
    skillList: ALL_SKILL_IDS,
    armor: "Light armor",
    weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
    tools: "Three musical instruments",
    armorKit: { label: "Leather armor", base: 11, dex: "full", shield: false },
    spellcasting: {
      ability: "cha",
      startLevel: 1,
      cantrips: 2,
      known: 4,
      slots: 2,
      note: "Knows 2 cantrips and 4 spells from the bard list.",
    },
    features: [
      { name: "Bardic Inspiration (d6)", desc: "Bonus action: give a creature a d6 to add to one roll. CHA mod uses per long rest." },
    ],
    equipment: ["Rapier", "Diplomat's pack", "Lute", "Leather armor", "Dagger"],
  },
  {
    id: "cleric",
    name: "Cleric",
    blurb: "A priestly champion who wields divine magic in service of a higher power.",
    hitDie: 8,
    primary: ["wis"],
    saves: ["wis", "cha"],
    skillChoose: 2,
    skillList: ["history", "insight", "medicine", "persuasion", "religion"],
    armor: "Light & medium armor, shields",
    weapons: "Simple weapons",
    armorKit: { label: "Scale mail & shield", base: 14, dex: "max2", shield: true },
    spellcasting: {
      ability: "wis",
      startLevel: 1,
      cantrips: 3,
      known: "prepared",
      slots: 2,
      note: "Knows 3 cantrips; prepares WIS mod + level spells from the full cleric list.",
    },
    features: [
      { name: "Divine Domain (Life)", desc: "SRD domain: heavy armor proficiency and Disciple of Life (healing spells restore extra HP)." },
    ],
    equipment: ["Mace", "Scale mail", "Light crossbow & 20 bolts", "Priest's pack", "Shield", "Holy symbol"],
  },
  {
    id: "druid",
    name: "Druid",
    blurb: "A priest of the Old Faith, wielding the powers of nature and shapeshifting.",
    hitDie: 8,
    primary: ["wis"],
    saves: ["int", "wis"],
    skillChoose: 2,
    skillList: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"],
    armor: "Light & medium armor, shields (no metal)",
    weapons: "Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears",
    tools: "Herbalism kit",
    armorKit: { label: "Leather armor & wooden shield", base: 11, dex: "full", shield: true },
    spellcasting: {
      ability: "wis",
      startLevel: 1,
      cantrips: 2,
      known: "prepared",
      slots: 2,
      note: "Knows 2 cantrips; prepares WIS mod + level spells from the full druid list.",
    },
    features: [
      { name: "Druidic", desc: "Know the secret language of druids." },
    ],
    equipment: ["Wooden shield", "Scimitar", "Leather armor", "Explorer's pack", "Druidic focus"],
  },
  {
    id: "fighter",
    name: "Fighter",
    blurb: "A master of martial combat, skilled with a variety of weapons and armor.",
    hitDie: 10,
    primary: ["str", "dex"],
    saves: ["str", "con"],
    skillChoose: 2,
    skillList: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "perception", "survival"],
    armor: "All armor, shields",
    weapons: "Simple & martial weapons",
    armorKit: { label: "Chain mail & shield", base: 16, dex: "none", shield: true },
    features: [
      { name: "Fighting Style", desc: "Pick a style: Archery, Defense, Dueling, Great Weapon, Protection, or Two-Weapon Fighting." },
      { name: "Second Wind", desc: "Bonus action: regain 1d10 + fighter level HP, once per rest." },
    ],
    equipment: ["Chain mail", "Longsword & shield", "Light crossbow & 20 bolts", "Dungeoneer's pack"],
  },
  {
    id: "monk",
    name: "Monk",
    blurb: "A master of martial arts, harnessing inner power through discipline.",
    hitDie: 8,
    primary: ["dex", "wis"],
    saves: ["str", "dex"],
    skillChoose: 2,
    skillList: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"],
    armor: "None",
    weapons: "Simple weapons, shortswords",
    tools: "One artisan's tools or musical instrument",
    armorKit: { label: "Unarmored Defense", base: 10, dex: "full", shield: false, unarmored: "monk" },
    features: [
      { name: "Unarmored Defense", desc: "Without armor or shield, AC = 10 + DEX modifier + WIS modifier." },
      { name: "Martial Arts (d4)", desc: "Use DEX for unarmed/monk weapons; unarmed strike as a bonus action." },
    ],
    equipment: ["Shortsword", "Dungeoneer's pack", "10 darts"],
  },
  {
    id: "paladin",
    name: "Paladin",
    blurb: "A holy warrior bound by a sacred oath to stand against darkness.",
    hitDie: 10,
    primary: ["str", "cha"],
    saves: ["wis", "cha"],
    skillChoose: 2,
    skillList: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"],
    armor: "All armor, shields",
    weapons: "Simple & martial weapons",
    armorKit: { label: "Chain mail & shield", base: 16, dex: "none", shield: true },
    spellcasting: {
      ability: "cha",
      startLevel: 2,
      cantrips: 0,
      known: "prepared",
      slots: 0,
      note: "No spells at level 1; half-caster starting at level 2 (CHA).",
    },
    features: [
      { name: "Divine Sense", desc: "Detect celestials, fiends, and undead within 60 ft., 1 + CHA mod uses per long rest." },
      { name: "Lay on Hands", desc: "Healing pool of 5 HP × paladin level; restore HP or cure disease/poison by touch." },
    ],
    equipment: ["Chain mail", "Longsword & shield", "Five javelins", "Priest's pack", "Holy symbol"],
  },
  {
    id: "ranger",
    name: "Ranger",
    blurb: "A warrior of the wilds, hunting the threats that lurk at civilization's edge.",
    hitDie: 10,
    primary: ["dex", "wis"],
    saves: ["str", "dex"],
    skillChoose: 3,
    skillList: ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"],
    armor: "Light & medium armor, shields",
    weapons: "Simple & martial weapons",
    armorKit: { label: "Scale mail", base: 14, dex: "max2", shield: false },
    spellcasting: {
      ability: "wis",
      startLevel: 2,
      cantrips: 0,
      known: 0,
      slots: 0,
      note: "No spells at level 1; half-caster starting at level 2 (WIS).",
    },
    features: [
      { name: "Favored Enemy", desc: "Choose a creature type: advantage on Survival to track it and INT checks to recall lore." },
      { name: "Natural Explorer", desc: "Choose a favored terrain: expertise-like benefits when traveling there." },
    ],
    equipment: ["Scale mail", "Two shortswords", "Explorer's pack", "Longbow & quiver of 20 arrows"],
  },
  {
    id: "rogue",
    name: "Rogue",
    blurb: "A scoundrel who uses stealth, skill, and precision to overcome any obstacle.",
    hitDie: 8,
    primary: ["dex"],
    saves: ["dex", "int"],
    skillChoose: 4,
    skillList: [
      "acrobatics", "athletics", "deception", "insight", "intimidation", "investigation",
      "perception", "performance", "persuasion", "sleight-of-hand", "stealth",
    ],
    armor: "Light armor",
    weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
    tools: "Thieves' tools",
    armorKit: { label: "Leather armor", base: 11, dex: "full", shield: false },
    features: [
      { name: "Expertise", desc: "Double proficiency bonus on two of your skill or thieves' tools proficiencies." },
      { name: "Sneak Attack (1d6)", desc: "Once per turn, +1d6 damage when you have advantage or an ally is adjacent to the target." },
      { name: "Thieves' Cant", desc: "Secret dialect of code words and signs used by criminals." },
    ],
    equipment: ["Rapier", "Shortbow & quiver of 20 arrows", "Burglar's pack", "Leather armor", "Two daggers", "Thieves' tools"],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    blurb: "A spellcaster who draws on inborn magic gifted by an exotic bloodline.",
    hitDie: 6,
    primary: ["cha"],
    saves: ["con", "cha"],
    skillChoose: 2,
    skillList: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"],
    armor: "None",
    weapons: "Daggers, darts, slings, quarterstaffs, light crossbows",
    armorKit: { label: "Unarmored", base: 10, dex: "full", shield: false },
    spellcasting: {
      ability: "cha",
      startLevel: 1,
      cantrips: 4,
      known: 2,
      slots: 2,
      note: "Knows 4 cantrips and 2 spells from the sorcerer list.",
    },
    features: [
      { name: "Sorcerous Origin (Draconic Bloodline)", desc: "SRD origin: dragon ancestor, +1 HP per level, AC 13 + DEX without armor." },
    ],
    equipment: ["Light crossbow & 20 bolts", "Arcane focus", "Dungeoneer's pack", "Two daggers"],
  },
  {
    id: "warlock",
    name: "Warlock",
    blurb: "A wielder of magic derived from a bargain with an otherworldly patron.",
    hitDie: 8,
    primary: ["cha"],
    saves: ["wis", "cha"],
    skillChoose: 2,
    skillList: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
    armor: "Light armor",
    weapons: "Simple weapons",
    armorKit: { label: "Leather armor", base: 11, dex: "full", shield: false },
    spellcasting: {
      ability: "cha",
      startLevel: 1,
      cantrips: 2,
      known: 2,
      slots: 1,
      note: "Pact Magic: 2 cantrips, 2 known spells, 1 slot that recharges on a short rest.",
    },
    features: [
      { name: "Otherworldly Patron (The Fiend)", desc: "SRD patron: Dark One's Blessing grants temp HP when you drop a foe." },
    ],
    equipment: ["Light crossbow & 20 bolts", "Arcane focus", "Scholar's pack", "Leather armor", "Any simple weapon", "Two daggers"],
  },
  {
    id: "wizard",
    name: "Wizard",
    blurb: "A scholarly magic-user who bends reality through study and preparation.",
    hitDie: 6,
    primary: ["int"],
    saves: ["int", "wis"],
    skillChoose: 2,
    skillList: ["arcana", "history", "insight", "investigation", "medicine", "religion"],
    armor: "None",
    weapons: "Daggers, darts, slings, quarterstaffs, light crossbows",
    armorKit: { label: "Unarmored", base: 10, dex: "full", shield: false },
    spellcasting: {
      ability: "int",
      startLevel: 1,
      cantrips: 3,
      known: "spellbook",
      slots: 2,
      note: "Knows 3 cantrips; spellbook holds 6 spells, prepares INT mod + level daily.",
    },
    features: [
      { name: "Arcane Recovery", desc: "Once per day on a short rest, recover spell slots totaling half your level (rounded up)." },
    ],
    equipment: ["Quarterstaff", "Component pouch", "Scholar's pack", "Spellbook"],
  },
];

// --- Backgrounds -----------------------------------------------------------------
// Acolyte is SRD; the rest use the standard 5e background mechanics
// (two skills + tools/languages + a feature), summarized without flavor text.

export type Background = {
  id: string;
  name: string;
  blurb: string;
  skills: string[];
  /** Tool proficiencies granted, human readable. */
  tools?: string;
  extraLanguages?: number;
  feature: Trait;
};

export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    blurb: "You spent your life in service to a temple.",
    skills: ["insight", "religion"],
    extraLanguages: 2,
    feature: { name: "Shelter of the Faithful", desc: "Free healing and shelter at temples of your faith." },
  },
  {
    id: "charlatan",
    name: "Charlatan",
    blurb: "You've always had a way with people — and their money.",
    skills: ["deception", "sleight-of-hand"],
    tools: "Disguise kit, forgery kit",
    feature: { name: "False Identity", desc: "A second identity with documentation and disguises." },
  },
  {
    id: "criminal",
    name: "Criminal",
    blurb: "You have a history of breaking the law and surviving it.",
    skills: ["deception", "stealth"],
    tools: "Thieves' tools, one gaming set",
    feature: { name: "Criminal Contact", desc: "A reliable contact in the criminal underworld." },
  },
  {
    id: "entertainer",
    name: "Entertainer",
    blurb: "You thrive in front of an audience.",
    skills: ["acrobatics", "performance"],
    tools: "Disguise kit, one musical instrument",
    feature: { name: "By Popular Demand", desc: "Free lodging in exchange for performing." },
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    blurb: "You come from humble origins, but you are destined for more.",
    skills: ["animal-handling", "survival"],
    tools: "One artisan's tools, vehicles (land)",
    feature: { name: "Rustic Hospitality", desc: "Common folk will shelter and hide you." },
  },
  {
    id: "guild-artisan",
    name: "Guild Artisan",
    blurb: "You are a member of a guild of skilled craftspeople.",
    skills: ["insight", "persuasion"],
    tools: "One artisan's tools",
    extraLanguages: 1,
    feature: { name: "Guild Membership", desc: "Lodging, legal aid, and connections through your guild." },
  },
  {
    id: "hermit",
    name: "Hermit",
    blurb: "You lived in seclusion, seeking enlightenment or hiding from the world.",
    skills: ["medicine", "religion"],
    tools: "Herbalism kit",
    extraLanguages: 1,
    feature: { name: "Discovery", desc: "Your isolation revealed a great and unique truth." },
  },
  {
    id: "noble",
    name: "Noble",
    blurb: "You understand wealth, power, and privilege from birth.",
    skills: ["history", "persuasion"],
    tools: "One gaming set",
    extraLanguages: 1,
    feature: { name: "Position of Privilege", desc: "High society welcomes you; common folk accommodate you." },
  },
  {
    id: "outlander",
    name: "Outlander",
    blurb: "You grew up in the wilds, far from civilization.",
    skills: ["athletics", "survival"],
    tools: "One musical instrument",
    extraLanguages: 1,
    feature: { name: "Wanderer", desc: "Excellent memory for geography; find food and water for six people daily." },
  },
  {
    id: "sage",
    name: "Sage",
    blurb: "You spent years learning the lore of the multiverse.",
    skills: ["arcana", "history"],
    extraLanguages: 2,
    feature: { name: "Researcher", desc: "You know where to find any piece of information." },
  },
  {
    id: "sailor",
    name: "Sailor",
    blurb: "You sailed on a seagoing vessel for years.",
    skills: ["athletics", "perception"],
    tools: "Navigator's tools, vehicles (water)",
    feature: { name: "Ship's Passage", desc: "Free passage on sailing ships for you and your companions." },
  },
  {
    id: "soldier",
    name: "Soldier",
    blurb: "War has been your life for as long as you care to remember.",
    skills: ["athletics", "intimidation"],
    tools: "One gaming set, vehicles (land)",
    feature: { name: "Military Rank", desc: "Soldiers loyal to your former organization still recognize your authority." },
  },
  {
    id: "urchin",
    name: "Urchin",
    blurb: "You grew up on the streets, alone, orphaned, and poor.",
    skills: ["sleight-of-hand", "stealth"],
    tools: "Disguise kit, thieves' tools",
    feature: { name: "City Secrets", desc: "Travel through cities twice as fast using secret passages." },
  },
];

// --- Ability score generation ----------------------------------------------------

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/** Point-buy cost per score (27 points total, scores 8–15). */
export const POINT_BUY_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

// --- Lookups -----------------------------------------------------------------------

export const raceById = (id: string) => RACES.find((r) => r.id === id);
export const subraceById = (race: Race | undefined, id?: string) =>
  race?.subraces?.find((s) => s.id === id);
export const classById = (id: string) => CLASSES.find((c) => c.id === id);
export const backgroundById = (id: string) => BACKGROUNDS.find((b) => b.id === id);
export const skillById = (id: string) => SKILLS.find((s) => s.id === id);
