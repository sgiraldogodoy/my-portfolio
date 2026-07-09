import { Schema, model } from "mongoose";

/**
 * A named trade session ("cambio"): stickers reserved to hand over (give) and
 * expected back (receive). Stays editable while "abierto"; authorizing it
 * applies both sides to the owner's collection and marks it "completado".
 */
const tradeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    status: { type: String, enum: ["abierto", "completado"], default: "abierto" },
    give: { type: Map, of: Number, default: {} },
    receive: { type: Map, of: Number, default: {} },
  },
  { timestamps: true },
);

export const Trade = model("Trade", tradeSchema);
