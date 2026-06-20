import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "../config/env.js";

// Some networks (campus/corporate) refuse the SRV/TXT DNS lookups that the
// mongodb+srv:// scheme relies on. Resolve through public DNS first so the
// connection works regardless of the local resolver.
dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);

/**
 * Connect to MongoDB. If no URI is configured we skip gracefully so the rest of
 * the app still runs in dev (contact messages just won't persist).
 */
export async function connectDb(): Promise<boolean> {
  if (!env.mongoUri) {
    console.warn("⚠️  MONGODB_URI not set, running without a database.");
    return false;
  }
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    return false;
  }
}

export function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}
