import { Schema, model, Document } from "mongoose";
import { ROLE } from "../utils/app.constants";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: ROLE;
  phone?: string;
  cccd?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Number, 
            enum: [ROLE.TENANT, ROLE.OWNER],
            default: ROLE.TENANT
          },
    phone: String,
    cccd: String,
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
