import { Router } from "express";
import { z } from "zod";
import { dbReady } from "../db/connect.js";
import { StickerCollection } from "../models/StickerCollection.js";
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
