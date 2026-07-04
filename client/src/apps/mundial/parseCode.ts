import { TEAM_CODE_SET } from "./data/album";

/**
 * Normalizes user input ("cze 7", "CZE-7", "fwc3", "00") to a canonical
 * sticker key, or null if it isn't a valid album code.
 */
export function parseCode(input: string): string | null {
  const code = input.toUpperCase().replace(/[\s-]/g, "");
  if (code === "00") return code;
  if (/^FWC([1-9]|1[0-9])$/.test(code)) return code;
  if (/^CC([1-9]|1[0-4])$/.test(code)) return code;
  const m = /^([A-Z]{3})([1-9]|1[0-9]|20)$/.exec(code);
  if (m && TEAM_CODE_SET.has(m[1])) return code;
  return null;
}
