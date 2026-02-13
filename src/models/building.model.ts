import { Schema, model, Document } from "mongoose";

export interface IBuilding extends Document {
  name: string;
  address: string;
  district: string;
  city: string;
  totalFloors: number;
  totalRooms: number;
  yearBuilt: number;
  ownerId: string; 
  description?: string;
  utilities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const buildingSchema = new Schema<IBuilding>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    totalFloors: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    yearBuilt: { type: Number, required: true },
    ownerId: { type: String, required: true },
    description: { type: String, default: "" },
    utilities: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IBuilding>("Building", buildingSchema);