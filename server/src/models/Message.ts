import { Schema, model } from "mongoose";

/** A contact-form submission. */
const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    ip: { type: String },
  },
  { timestamps: true },
);

export const Message = model("Message", messageSchema);
