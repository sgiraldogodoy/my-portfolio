import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isProd } from "../config/env.js";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// Express recognizes error handlers by their 4-arg signature.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid input",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  console.error(err);
  res.status(500).json({
    error: isProd ? "Internal server error" : String(err),
  });
}
