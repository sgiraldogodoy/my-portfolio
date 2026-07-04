import { createApp } from "./app.js";
import { connectDb } from "./db/connect.js";
import { env, isProd } from "./config/env.js";

async function main() {
  if (isProd && !env.jwtSecret) {
    console.warn("⚠️  JWT_SECRET not set in production — portal logins will fail.");
  }
  await connectDb(); // non-fatal if not configured
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 API listening on http://localhost:${env.port}`);
    console.log(`   env: ${env.nodeEnv}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
