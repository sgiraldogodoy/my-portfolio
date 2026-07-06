import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { dbReady } from "./db/connect.js";
import { aiEnabled } from "./services/ai.js";
import { emailEnabled } from "./services/email.js";
import { contactRouter } from "./routes/contact.js";
import { chatRouter } from "./routes/chat.js";
import { authRouter } from "./routes/auth.js";
import { mundialRouter } from "./routes/mundial.js";
import { finanzasRouter } from "./routes/finanzas.js";
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
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  // Mounted before the 32kb JSON cap: statement PDFs need a bigger body limit,
  // and the router brings its own parser and per-route rate limit.
  app.use("/api/finanzas", finanzasRouter);

  app.use(express.json({ limit: "32kb" }));

  // Global, generous rate limit; the AI and login routes add stricter ones of
  // their own. Sized so a long sticker-entry session doesn't hit 429s.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // --- Routes -----------------------------------------------------------------
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", db: dbReady(), ai: aiEnabled(), email: emailEnabled() });
  });
  app.use("/api/contact", contactRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/mundial", mundialRouter);

  // --- Fallbacks --------------------------------------------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
