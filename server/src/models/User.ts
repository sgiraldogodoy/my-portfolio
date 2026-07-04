import { Schema, model } from "mongoose";

/** A portal user. Accounts are created via the create-user script only. */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
