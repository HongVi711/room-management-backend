import { Schema, model, Document } from "mongoose";
import { ROLE } from "../utils/app.constants";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: ROLE;
  phone?: number;
  cccd?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: Number,
      enum: [ROLE.TENANT, ROLE.OWNER],
      default: ROLE.TENANT,
    },
    phone: { type: Number },
    cccd: String,
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
