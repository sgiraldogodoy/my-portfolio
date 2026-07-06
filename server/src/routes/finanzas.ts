import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { scanEnabled, scanStatement } from "../services/statementScan.js";

/**
 * Session-only statement scanning. This router deliberately touches no
 * database and must never log request bodies: the uploaded PDF and the
 * extracted transactions exist only for the lifetime of the request.
 */
export const finanzasRouter = Router();

// PDFs are far bigger than the app-wide 32kb JSON cap, so this router is
// mounted before the global body parser (see app.ts) and brings its own.
// 15mb of JSON fits a ~11mb PDF after base64 overhead.
finanzasRouter.use(express.json({ limit: "15mb" }));

finanzasRouter.use(requireAuth);

// Tight limit: each scan is a paid, multi-thousand-token AI call.
const scanLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados escaneos, espera unos minutos." },
});

const scanSchema = z.object({
  pdf: z
    .string()
    .min(100)
    .max(15_000_000)
    .regex(/^[A-Za-z0-9+/=]+$/, "Se esperaba base64"),
});

finanzasRouter.post("/scan", scanLimiter, async (req, res, next) => {
  try {
    if (!scanEnabled()) {
      return res.status(503).json({ error: "El escaneo con IA no está configurado." });
    }
    const { pdf } = scanSchema.parse(req.body);
    // "%PDF" in base64 — cheap sanity check that this is actually a PDF.
    if (!pdf.startsWith("JVBER")) {
      return res.status(400).json({ error: "El archivo no parece ser un PDF." });
    }
    const transactions = await scanStatement(pdf);
    res.json({ transactions });
  } catch (err) {
    next(err);
  }
});
