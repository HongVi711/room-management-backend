import { Schema, model, Document, Types } from "mongoose";
import { ROOMSTATUS } from "../utils/app.constants";

export interface IRoom extends Document {
  number: string;
  buildingId: Types.ObjectId;
  floor: number;
  area: number;
  price: number;
  status: ROOMSTATUS;
  currentTenant?: Types.ObjectId;
  description?: string;
}

const roomSchema = new Schema<IRoom>(
  {
    number: { type: String, required: true },
    buildingId: { type: Schema.Types.ObjectId, ref: "Building", required: true },
    floor: { type: Number, required: true },
    area: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: [ROOMSTATUS.AVAILABLE, ROOMSTATUS.OCCUPIED, ROOMSTATUS.MAINTENANCE],
      default: ROOMSTATUS.AVAILABLE,
      required: true,
    },
    currentTenant: { type: Schema.Types.ObjectId, ref: "User" },
    description: String,
  },
  { timestamps: true }
);

export default model<IRoom>("Room", roomSchema);