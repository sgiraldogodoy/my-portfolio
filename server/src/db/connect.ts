import mongoose from "mongoose";
import { env } from "../config/env.js";

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
