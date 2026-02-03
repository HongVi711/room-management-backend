import { Schema, model } from "mongoose";

const tokenBlacklistSchema = new Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export default model("TokenBlacklist", tokenBlacklistSchema);
