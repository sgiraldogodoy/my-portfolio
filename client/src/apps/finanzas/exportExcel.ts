import { ACCOUNTS, type Transaction } from "./data/constants";

const MONEY_FMT = '"$"#,##0.00;[Red]-"$"#,##0.00';
const HEADER_FILL = "FF7C5CFF"; // matches --color-accent

/** Builds the .xlsx in the browser and triggers a download. Nothing leaves the page. */
export async function exportToExcel(transactions: Transaction[]) {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  wb.created = new Date();

  // --- Sheet 1: transactions, oldest first ---
  const txSheet = wb.addWorksheet("Transacciones", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  txSheet.columns = [
    { header: "Fecha", key: "date", width: 12 },
    { header: "Descripción", key: "description", width: 40 },
    { header: "Cuenta", key: "account", width: 14 },
    { header: "Categoría", key: "category", width: 20 },
    { header: "Monto", key: "amount", width: 14, style: { numFmt: MONEY_FMT } },
  ];

  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  for (const tx of sorted) {
    const row = txSheet.addRow({
      // Noon avoids the date shifting a day in negative-UTC timezones.
      date: new Date(`${tx.date}T12:00:00`),
      description: tx.description,
      account: tx.account,
      category: tx.category,
      amount: tx.amount,
    });
    row.getCell("date").numFmt = "yyyy-mm-dd";
  }
  styleHeader(txSheet);
  txSheet.autoFilter = { from: "A1", to: `E${sorted.length + 1}` };

  // --- Sheet 2: balance per account ---
  const balSheet = wb.addWorksheet("Balances");
  balSheet.columns = [
    { header: "Cuenta", key: "account", width: 16 },
    { header: "Balance", key: "balance", width: 16, style: { numFmt: MONEY_FMT } },
  ];

  const balances = new Map<string, number>(ACCOUNTS.map((a) => [a, 0]));
  for (const tx of transactions) {
    balances.set(tx.account, (balances.get(tx.account) ?? 0) + tx.amount);
  }
  for (const account of ACCOUNTS) {
    balSheet.addRow({ account, balance: balances.get(account) });
  }
  const totalRow = balSheet.addRow({
    account: "Total",
    balance: transactions.reduce((sum, tx) => sum + tx.amount, 0),
  });
  totalRow.font = { bold: true };
  totalRow.border = { top: { style: "thin" } };
  styleHeader(balSheet);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transacciones-${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}

function styleHeader(sheet: import("exceljs").Worksheet) {
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
  });
}
