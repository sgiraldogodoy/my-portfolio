import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { dbReady } from "../db/connect.js";
import { User } from "../models/User.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

// Tight limit: brute-forcing passwords should be impractical.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, try again later." },
});

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(200),
});

authRouter.post("/login", loginLimiter, async (req, res, next) => {
  try {
    if (!dbReady()) {
      return res.status(503).json({ error: "Database unavailable, try again shortly." });
    }
    const { username, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ username: username.toLowerCase() });
    // Same message for unknown user and wrong password.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ sub: user.id, username: user.username }, env.jwtSecret, {
      expiresIn: "30d",
    });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: { id: req.userId, username: req.username } });
});
