import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { dbReady } from "../db/connect.js";
import { StickerCollection } from "../models/StickerCollection.js";
import { Trade } from "../models/Trade.js";
import { isValidCode } from "../data/mundialCodes.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const mundialRouter = Router();

mundialRouter.use(requireAuth);

mundialRouter.use((_req, res, next) => {
  if (!dbReady()) {
    return res.status(503).json({ error: "Database unavailable, try again shortly." });
  }
  next();
});

mundialRouter.get("/collection", async (req: AuthedRequest, res, next) => {
  try {
    const doc = await StickerCollection.findOne({ userId: req.userId });
    res.json({ stickers: doc ? Object.fromEntries(doc.stickers) : {} });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  code: z.string().trim().max(10),
  delta: z.union([z.literal(1), z.literal(-1)]),
});

mundialRouter.post("/collection/update", async (req: AuthedRequest, res, next) => {
  try {
    const { code: rawCode, delta } = updateSchema.parse(req.body);
    const code = rawCode.toUpperCase().replace(/[\s-]/g, "");
    if (!isValidCode(code)) {
      return res.status(400).json({ error: "Código inválido" });
    }
    const field = `stickers.${code}`;

    let doc;
    if (delta === 1) {
      doc = await StickerCollection.findOneAndUpdate(
        { userId: req.userId },
        { $inc: { [field]: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } else {
      // Atomic clamp: only decrement when the current count is > 0.
      doc = await StickerCollection.findOneAndUpdate(
        { userId: req.userId, [field]: { $gt: 0 } },
        { $inc: { [field]: -1 } },
        { new: true },
      );
    }
    res.json({ code, count: doc?.stickers.get(code) ?? 0 });
  } catch (err) {
    next(err);
  }
});

// --- Cambios (trade sessions) --------------------------------------------------

type TradeDoc = InstanceType<typeof Trade>;

function serializeTrade(doc: TradeDoc) {
  return {
    id: doc.id,
    name: doc.name,
    status: doc.status,
    give: Object.fromEntries(doc.give),
    receive: Object.fromEntries(doc.receive),
    updatedAt: doc.updatedAt,
  };
}

async function findOwnTrade(req: AuthedRequest): Promise<TradeDoc | null> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return null;
  return Trade.findOne({ _id: id, userId: req.userId });
}

const qtyMapSchema = z.record(z.string().max(10), z.number().int().min(1).max(99));

function invalidCode(rec: Record<string, number>): string | null {
  for (const code of Object.keys(rec)) {
    if (!isValidCode(code)) return code;
  }
  return null;
}

mundialRouter.get("/trades", async (req: AuthedRequest, res, next) => {
  try {
    const docs = await Trade.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json({ trades: docs.map(serializeTrade) });
  } catch (err) {
    next(err);
  }
});

mundialRouter.post("/trades", async (req: AuthedRequest, res, next) => {
  try {
    const { name } = z.object({ name: z.string().trim().min(1).max(100) }).parse(req.body);
    const doc = await Trade.create({ userId: req.userId, name });
    res.json({ trade: serializeTrade(doc) });
  } catch (err) {
    next(err);
  }
});

const tradePatchSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  give: qtyMapSchema.optional(),
  receive: qtyMapSchema.optional(),
});

mundialRouter.post("/trades/:id", async (req: AuthedRequest, res, next) => {
  try {
    const patch = tradePatchSchema.parse(req.body);
    const bad = invalidCode(patch.give ?? {}) ?? invalidCode(patch.receive ?? {});
    if (bad) return res.status(400).json({ error: `Código inválido: ${bad}` });
    const doc = await findOwnTrade(req);
    if (!doc) return res.status(404).json({ error: "Cambio no encontrado" });
    if (doc.status !== "abierto" && (patch.give || patch.receive)) {
      return res.status(409).json({ error: "El cambio ya fue autorizado" });
    }
    if (patch.name !== undefined) doc.name = patch.name;
    if (patch.give) doc.set("give", patch.give);
    if (patch.receive) doc.set("receive", patch.receive);
    await doc.save();
    res.json({ trade: serializeTrade(doc) });
  } catch (err) {
    next(err);
  }
});

mundialRouter.post("/trades/:id/delete", async (req: AuthedRequest, res, next) => {
  try {
    const doc = await findOwnTrade(req);
    if (!doc) return res.status(404).json({ error: "Cambio no encontrado" });
    await doc.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

mundialRouter.post("/trades/:id/authorize", async (req: AuthedRequest, res, next) => {
  try {
    const doc = await findOwnTrade(req);
    if (!doc) return res.status(404).json({ error: "Cambio no encontrado" });
    if (doc.status !== "abierto") {
      return res.status(409).json({ error: "El cambio ya fue autorizado" });
    }

    // Every given sticker must leave at least one copy in the album.
    const coll = await StickerCollection.findOne({ userId: req.userId });
    for (const [code, qty] of doc.give) {
      const owned = coll?.stickers.get(code) ?? 0;
      if (owned - qty < 1) {
        return res.status(409).json({ error: `No hay suficientes copias de ${code}` });
      }
    }

    const inc: Record<string, number> = {};
    for (const [code, qty] of doc.give) inc[`stickers.${code}`] = (inc[`stickers.${code}`] ?? 0) - qty;
    for (const [code, qty] of doc.receive) inc[`stickers.${code}`] = (inc[`stickers.${code}`] ?? 0) + qty;
    let stickers: Record<string, number> = coll ? Object.fromEntries(coll.stickers) : {};
    if (Object.keys(inc).length > 0) {
      const updated = await StickerCollection.findOneAndUpdate(
        { userId: req.userId },
        { $inc: inc },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      stickers = Object.fromEntries(updated!.stickers);
    }

    doc.status = "completado";
    await doc.save();
    res.json({ trade: serializeTrade(doc), stickers });
  } catch (err) {
    next(err);
  }
});
