import { Router } from "express";
import { z } from "zod";
import { Message } from "../models/Message.js";
import { dbReady } from "../db/connect.js";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
});

contactRouter.post("/", async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);

    if (dbReady()) {
      await Message.create({ ...data, ip: req.ip });
    } else {
      // No DB configured, so log it to avoid silently losing the message in dev.
      console.log("📨 Contact (not persisted, no DB):", data);
    }

    // TODO: wire up an email notification (e.g. AWS SES) here.
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
