import "dotenv/config";

/** Centralized, validated environment access. Import `env` everywhere else. */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI ?? "",
  jwtSecret:
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV === "production" ? "" : "dev-secret"),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
  // AWS SES (contact-form email notifications)
  awsRegion: process.env.AWS_REGION ?? "",
  sesFrom: process.env.SES_FROM ?? "", // verified sender identity
  sesTo: process.env.SES_TO ?? "", // where contact emails are delivered
} as const;

export const isProd = env.nodeEnv === "production";
