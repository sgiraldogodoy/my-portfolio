import {
  COCA_CODES,
  GROUPS,
  SPECIAL_CODES,
  STICKERS_PER_TEAM,
  TEAMS,
  TOTAL_STICKERS,
  stickerKey,
} from "./data/album";
import { FILTERS, matchesFilter, type Filter } from "./FilterBar";
import type { Counts } from "./useCollection";

const HEADER_FILL = "FF7C5CFF"; // matches --color-accent

/** One sticker within a row: display label, position in a numeric run (or null), copies owned. */
type Item = { label: string; seq: number | null; count: number };

/**
 * Joins stickers into the shortest readable text: consecutive runs collapse to
 * ranges ("4-9"), and with `annotate` repeats carry their count ("15 ×2").
 */
function formatItems(items: Item[], annotate: boolean): string {
  const parts: string[] = [];
  let i = 0;
  while (i < items.length) {
    if (annotate && items[i].count > 1) {
      parts.push(`${items[i].label} ×${items[i].count}`);
      i += 1;
      continue;
    }
    let j = i;
    while (
      j + 1 < items.length &&
      items[j].seq !== null &&
      items[j + 1].seq === (items[j].seq as number) + 1 &&
      !(annotate && items[j + 1].count > 1)
    ) {
      j += 1;
    }
    if (j - i >= 2) {
      parts.push(`${items[i].label}-${items[j].seq}`);
    } else {
      for (let k = i; k <= j; k++) parts.push(items[k].label);
    }
    i = j + 1;
  }
  return parts.join(", ");
}

type RowData = { grupo: string; equipo: string; cant: string; estampas: string };

/** Builds one export row from a section's stickers, or null when the filter leaves it empty. */
function buildRow(
  grupo: string,
  equipo: string,
  all: Item[],
  filter: Filter,
): RowData | null {
  if (filter === "todas") {
    const owned = all.filter((it) => it.count >= 1);
    const missing = all.filter((it) => it.count === 0);
    const pieces = [];
    if (owned.length) pieces.push(`Tengo: ${formatItems(owned, true)}`);
    if (missing.length) pieces.push(`Faltan: ${formatItems(missing, false)}`);
    return {
      grupo,
      equipo,
      cant: `${owned.length}/${all.length}`,
      estampas: pieces.join("   ·   "),
    };
  }
  const matching = all.filter((it) => matchesFilter(it.count, filter));
  if (matching.length === 0) return null;
  if (filter === "repetidas") {
    // Trade list: one entry per copy you can give away (one copy stays in the
    // album), each listed individually — no ranges — so "6 ×3" prints as "6, 6".
    const giveaway = matching.flatMap((it) =>
      Array.from({ length: it.count - 1 }, () => it.label),
    );
    return {
      grupo,
      equipo,
      cant: String(giveaway.length),
      estampas: giveaway.join(", "),
    };
  }
  return {
    grupo,
    equipo,
    cant: String(matching.length),
    estampas: formatItems(matching, filter !== "faltan"),
  };
}

function specialItems(codes: string[], counts: Counts): Item[] {
  return codes.map((code) => {
    const m = /^([A-Z]+)(\d+)$/.exec(code);
    return {
      label: m ? `${m[1]} ${m[2]}` : code,
      seq: m ? Number(m[2]) : null,
      count: counts[code] ?? 0,
    };
  });
}

export type ExportOptions = {
  counts: Counts;
  filter: Filter;
  group: string; // "todos" | "A".."L"
  teamCode: string; // "todos" | team code
};

export async function buildWorkbook({ counts, filter, group, teamCode }: ExportOptions) {
  // exceljs is CJS; the named export exists under Vite but not under plain Node.
  const mod = await import("exceljs");
  const Workbook = mod.Workbook ?? mod.default.Workbook;
  const wb = new Workbook();
  wb.created = new Date();

  const sheet = wb.addWorksheet("Estampas", {
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
  });
  sheet.columns = [
    { key: "grupo", width: 8 },
    { key: "equipo", width: 24 },
    { key: "cant", width: 7 },
    { key: "estampas", width: 78 },
  ];

  // --- Title + context ---
  const filterLabel = FILTERS.find((f) => f.id === filter)?.label ?? filter;
  const team = TEAMS.find((t) => t.code === teamCode);
  const scope = [
    `Filtro: ${filterLabel}`,
    group !== "todos" ? `Grupo ${group}` : null,
    team ? team.name : null,
  ]
    .filter(Boolean)
    .join(" · ");

  let owned = 0;
  let repeats = 0;
  for (const count of Object.values(counts)) {
    if (count >= 1) owned += 1;
    if (count > 1) repeats += count - 1;
  }

  sheet.mergeCells("A1:D1");
  const title = sheet.getCell("A1");
  title.value = "Álbum Mundial 2026";
  title.font = { bold: true, size: 14 };

  sheet.mergeCells("A2:D2");
  sheet.getCell("A2").value =
    `${scope} · Progreso: ${owned}/${TOTAL_STICKERS} · faltan ${TOTAL_STICKERS - owned} · ${repeats} repes · ${new Date().toISOString().slice(0, 10)}`;
  sheet.getCell("A2").font = { size: 9, color: { argb: "FF666666" } };

  // --- Header ---
  const header = sheet.addRow(["Grupo", "Equipo", "Cant.", "Estampas"]);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
  });

  // --- Rows (mirror the on-screen order and visibility) ---
  const rows: RowData[] = [];
  if (group === "todos" && teamCode === "todos") {
    const fifa = buildRow("", "Especiales FIFA", specialItems(SPECIAL_CODES, counts), filter);
    const coca = buildRow("", "Coca-Cola", specialItems(COCA_CODES, counts), filter);
    if (fifa) rows.push(fifa);
    if (coca) rows.push(coca);
  }
  for (const g of GROUPS) {
    if (group !== "todos" && g !== group) continue;
    for (const t of TEAMS.filter((t) => t.group === g)) {
      if (teamCode !== "todos" && t.code !== teamCode) continue;
      const items: Item[] = Array.from({ length: STICKERS_PER_TEAM }, (_, i) => ({
        label: String(i + 1),
        seq: i + 1,
        count: counts[stickerKey(t.code, i + 1)] ?? 0,
      }));
      const row = buildRow(g, `${t.name} (${t.code})`, items, filter);
      if (row) rows.push(row);
    }
  }
  for (const data of rows) {
    const row = sheet.addRow(data);
    row.getCell("estampas").alignment = { wrapText: true, vertical: "top" };
    row.getCell("cant").alignment = { horizontal: "center" };
  }

  return wb;
}

/** Builds the .xlsx in the browser and triggers a download. Nothing leaves the page. */
export async function exportToExcel(options: ExportOptions) {
  const { filter, group, teamCode } = options;
  const wb = await buildWorkbook(options);
  const team = TEAMS.find((t) => t.code === teamCode);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = [
    "mundial",
    filter,
    group !== "todos" ? `grupo${group}` : null,
    team ? team.code.toLowerCase() : null,
    new Date().toISOString().slice(0, 10),
  ]
    .filter(Boolean)
    .join("-");
  link.href = url;
  link.download = `${slug}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
