import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  userId?: string;
  username?: string;
}

/** Rejects the request with 401 unless a valid Bearer token is present. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    if (typeof payload.sub !== "string") throw new Error("bad token payload");
    req.userId = payload.sub;
    req.username = typeof payload.username === "string" ? payload.username : "";
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
