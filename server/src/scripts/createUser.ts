// Creates (or resets the password of) a portal user.
// Usage: npm run create-user -- <username> <password>
// Point MONGODB_URI (server/.env) at Atlas to create production users.
import dns from "node:dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

// Some home routers refuse the SRV lookups Atlas "mongodb+srv://" URIs need
// (querySrv ECONNREFUSED on Windows); public resolvers handle them fine.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Usage: npm run create-user -- <username> <password>");
    process.exit(1);
  }
  if (!env.mongoUri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  await mongoose.connect(env.mongoUri);
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOneAndUpdate(
    { username: username.toLowerCase() },
    { passwordHash },
    { upsert: true },
  );
  console.log(
    existing
      ? `🔑 Password updated for "${username.toLowerCase()}"`
      : `✅ User "${username.toLowerCase()}" created`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
