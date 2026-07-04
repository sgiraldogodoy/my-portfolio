import { Schema, model } from "mongoose";

/**
 * One document per user: sticker code -> count owned.
 * 0/absent = missing, 1 = have, >1 = repeats to trade.
 */
const stickerCollectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    stickers: { type: Map, of: Number, default: {} },
  },
  { timestamps: true },
);

export const StickerCollection = model("StickerCollection", stickerCollectionSchema);
