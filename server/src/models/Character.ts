import { Schema, model } from "mongoose";

/**
 * A saved D&D 5e character. `build` holds every player choice made in the
 * builder (race, class, ability scores, skills…); derived stats are always
 * recomputed client-side, so the server treats it as an opaque document
 * validated by the route's zod schema.
 */
const characterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    build: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, minimize: false },
);

export const Character = model("Character", characterSchema);
