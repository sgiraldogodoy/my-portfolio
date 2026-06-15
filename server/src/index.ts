import { createApp } from "./app.js";
import { connectDb } from "./db/connect.js";
import { env } from "./config/env.js";

async function main() {
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
