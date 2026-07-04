/**
 * Panini World Cup 2026 album catalog.
 * Canonical sticker keys are compact ("CZE7", "FWC3", "CC5", "00") to match
 * the server; display formatting adds the space ("CZE 7").
 */
export type Team = { code: string; name: string; group: string };

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Listed in album page order within each group.
export const TEAMS: Team[] = [
  { code: "MEX", name: "México", group: "A" },
  { code: "RSA", name: "Sudáfrica", group: "A" },
  { code: "KOR", name: "Corea del Sur", group: "A" },
  { code: "CZE", name: "Chequia", group: "A" },
  { code: "CAN", name: "Canadá", group: "B" },
  { code: "BIH", name: "Bosnia y Herzegovina", group: "B" },
  { code: "QAT", name: "Catar", group: "B" },
  { code: "SUI", name: "Suiza", group: "B" },
  { code: "BRA", name: "Brasil", group: "C" },
  { code: "MAR", name: "Marruecos", group: "C" },
  { code: "HAI", name: "Haití", group: "C" },
  { code: "SCO", name: "Escocia", group: "C" },
  { code: "USA", name: "Estados Unidos", group: "D" },
  { code: "PAR", name: "Paraguay", group: "D" },
  { code: "AUS", name: "Australia", group: "D" },
  { code: "TUR", name: "Turquía", group: "D" },
  { code: "GER", name: "Alemania", group: "E" },
  { code: "CUW", name: "Curazao", group: "E" },
  { code: "CIV", name: "Costa de Marfil", group: "E" },
  { code: "ECU", name: "Ecuador", group: "E" },
  { code: "NED", name: "Países Bajos", group: "F" },
  { code: "JPN", name: "Japón", group: "F" },
  { code: "SWE", name: "Suecia", group: "F" },
  { code: "TUN", name: "Túnez", group: "F" },
  { code: "BEL", name: "Bélgica", group: "G" },
  { code: "EGY", name: "Egipto", group: "G" },
  { code: "IRN", name: "Irán", group: "G" },
  { code: "NZL", name: "Nueva Zelanda", group: "G" },
  { code: "ESP", name: "España", group: "H" },
  { code: "CPV", name: "Cabo Verde", group: "H" },
  { code: "KSA", name: "Arabia Saudita", group: "H" },
  { code: "URU", name: "Uruguay", group: "H" },
  { code: "FRA", name: "Francia", group: "I" },
  { code: "SEN", name: "Senegal", group: "I" },
  { code: "IRQ", name: "Irak", group: "I" },
  { code: "NOR", name: "Noruega", group: "I" },
  { code: "ARG", name: "Argentina", group: "J" },
  { code: "ALG", name: "Argelia", group: "J" },
  { code: "AUT", name: "Austria", group: "J" },
  { code: "JOR", name: "Jordania", group: "J" },
  { code: "POR", name: "Portugal", group: "K" },
  { code: "COD", name: "RD del Congo", group: "K" },
  { code: "UZB", name: "Uzbekistán", group: "K" },
  { code: "COL", name: "Colombia", group: "K" },
  { code: "ENG", name: "Inglaterra", group: "L" },
  { code: "CRO", name: "Croacia", group: "L" },
  { code: "GHA", name: "Ghana", group: "L" },
  { code: "PAN", name: "Panamá", group: "L" },
];

export const STICKERS_PER_TEAM = 20;

/** "00" + FWC1–FWC19: especiales FIFA. */
export const SPECIAL_CODES = [
  "00",
  ...Array.from({ length: 19 }, (_, i) => `FWC${i + 1}`),
];

/** CC1–CC14: estampas Coca-Cola. */
export const COCA_CODES = Array.from({ length: 14 }, (_, i) => `CC${i + 1}`);

export const TOTAL_STICKERS =
  TEAMS.length * STICKERS_PER_TEAM + SPECIAL_CODES.length + COCA_CODES.length; // 994

export const TEAM_CODE_SET = new Set(TEAMS.map((t) => t.code));

export const stickerKey = (teamCode: string, n: number) => `${teamCode}${n}`;

/** "CZE7" -> "CZE 7", "FWC3" -> "FWC 3", "CC5" -> "CC 5", "00" -> "00". */
export function displayCode(key: string): string {
  const m = /^([A-Z]+)(\d+)$/.exec(key);
  return m ? `${m[1]} ${m[2]}` : key;
}
