import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "../config/env.js";

const client = env.anthropicApiKey
  ? new Anthropic({ apiKey: env.anthropicApiKey })
  : null;

export function scanEnabled(): boolean {
  return client !== null;
}

// Keep in sync with client/src/apps/finanzas/data/constants.ts
const CATEGORIES = [
  "Matrícula",
  "Vivienda",
  "Alimentación",
  "Salud",
  "Teléfono",
  "Lavandería y Aseo",
  "Paseos",
  "Break",
  "Diversión",
  "Libros y Materiales",
  "Casa, Ropa",
  "Pasajes",
  "Personal Santis",
  "JyM",
  "Movimientos",
  "Depósitos",
  "Salario",
] as const;

const FALLBACK_CATEGORY = "Movimientos";

export type ScannedTransaction = {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // always positive
  direction: "in" | "out";
  category: (typeof CATEGORIES)[number];
};

const SYSTEM = `You extract transactions from bank/card statements (PDFs, possibly scanned images, in Spanish or English).

Rules:
- Extract every individual transaction row. Skip running balances, subtotals, interest summaries, and marketing text.
- amount is always a positive number. direction is "out" for money leaving the account (purchases, fees, withdrawals) and "in" for money arriving (deposits, refunds, salary).
- date is ISO YYYY-MM-DD. If the statement omits the year, infer it from the statement period.
- description: the merchant/concept as printed, lightly cleaned up.
- category: your best guess from the allowed list; use "${FALLBACK_CATEGORY}" when unsure.
- If the document is not a bank statement or has no transactions, return an empty list.`;

const extractTool: Anthropic.Tool = {
  name: "record_transactions",
  description: "Record every transaction found in the statement.",
  input_schema: {
    type: "object",
    properties: {
      transactions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type: "string", description: "YYYY-MM-DD" },
            description: { type: "string" },
            amount: { type: "number", description: "Positive amount" },
            direction: { type: "string", enum: ["in", "out"] },
            category: { type: "string", enum: [...CATEGORIES] },
          },
          required: ["date", "description", "amount", "direction", "category"],
        },
      },
    },
    required: ["transactions"],
  },
};

// Lenient parse of the model output, then normalized below.
const resultSchema = z.object({
  transactions: z.array(
    z.object({
      date: z.string(),
      description: z.string().trim().min(1).max(200),
      amount: z.number(),
      direction: z.enum(["in", "out"]),
      category: z.string(),
    }),
  ),
});

/**
 * Sends the PDF to Claude and returns the extracted transactions.
 * The document only ever lives in memory here — nothing is written to disk,
 * logged, or stored; it goes out to the Anthropic API and the result comes back.
 */
export async function scanStatement(pdfBase64: string): Promise<ScannedTransaction[]> {
  if (!client) throw new Error("AI scanning is not configured.");

  const response = await client.messages.create({
    model: env.anthropicModel,
    max_tokens: 8192,
    system: SYSTEM,
    tools: [extractTool],
    tool_choice: { type: "tool", name: "record_transactions" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
          },
          { type: "text", text: "Extract all transactions from this statement." },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) throw new Error("The model returned no extraction result.");

  const { transactions } = resultSchema.parse(toolUse.input);

  return transactions
    .filter((tx) => Number.isFinite(tx.amount) && tx.amount !== 0)
    .map((tx) => ({
      date: /^\d{4}-\d{2}-\d{2}$/.test(tx.date)
        ? tx.date
        : new Date().toISOString().slice(0, 10),
      description: tx.description,
      amount: Math.abs(tx.amount),
      direction: tx.direction,
      category: (CATEGORIES as readonly string[]).includes(tx.category)
        ? (tx.category as ScannedTransaction["category"])
        : FALLBACK_CATEGORY,
    }));
}
