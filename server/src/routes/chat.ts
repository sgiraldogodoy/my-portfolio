import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { aiEnabled, generateReply } from "../services/ai.js";

export const chatRouter = Router();

// Stricter limit on the AI endpoint since it costs money per call.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages, please slow down." },
});

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

chatRouter.post("/", chatLimiter, async (req, res, next) => {
  try {
    if (!aiEnabled()) {
      return res.status(503).json({
        error: "The AI assistant isn't configured yet. Please use the contact form.",
      });
    }
    const { messages } = chatSchema.parse(req.body);
    const reply = await generateReply(messages);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});
