/**
 * Valid sticker codes for the Panini World Cup 2026 album.
 * Canonical keys are compact ("CZE7", "FWC3", "CC5", "00") — no spaces or dots,
 * since they double as Mongo Map keys.
 */
export const TEAM_CODES = new Set([
  "CZE", "MEX", "RSA", "KOR", // A
  "BIH", "CAN", "QAT", "SUI", // B
  "BRA", "HAI", "MAR", "SCO", // C
  "AUS", "PAR", "TUR", "USA", // D
  "CUW", "ECU", "GER", "CIV", // E
  "JAP", "NED", "SWE", "TUN", // F
  "BEL", "EGY", "IRN", "NZL", // G
  "CPV", "KSA", "ESP", "URU", // H
  "FRA", "IRQ", "NOR", "SEN", // I
  "ALG", "ARG", "AUT", "JOR", // J
  "COL", "COD", "POR", "UZB", // K
  "CRO", "ENG", "GHA", "PAN", // L
]);

export function isValidCode(code: string): boolean {
  if (code === "00") return true;
  if (/^FWC([1-9]|1[0-9])$/.test(code)) return true; // FWC1–FWC19
  if (/^CC([1-9]|1[0-4])$/.test(code)) return true; // CC1–CC14 (Coca-Cola)
  const m = /^([A-Z]{3})([1-9]|1[0-9]|20)$/.exec(code); // XXX1–XXX20
  return m !== null && TEAM_CODES.has(m[1]);
}
