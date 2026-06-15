import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { dbReady } from "./db/connect.js";
import { aiEnabled } from "./services/ai.js";
import { contactRouter } from "./routes/contact.js";
import { chatRouter } from "./routes/chat.js";
import { errorHandler, notFound } from "./middleware/error.js";

export function createApp() {
  const app = express();

  // --- Security & hardening ---------------------------------------------------
  app.set("trust proxy", 1); // correct client IPs behind a load balancer (App Runner)
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ["GET", "POST"],
    }),
  );
  app.use(express.json({ limit: "32kb" }));

  // Global, generous rate limit; the AI route adds a stricter one of its own.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // --- Routes -----------------------------------------------------------------
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", db: dbReady(), ai: aiEnabled() });
  });
  app.use("/api/contact", contactRouter);
  app.use("/api/chat", chatRouter);

  // --- Fallbacks --------------------------------------------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
