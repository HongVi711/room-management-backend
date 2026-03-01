import { Schema, model, Document, Types } from "mongoose";

export interface IBuilding extends Document {
  name: string;
  address: string;
  district: string;
  city: string;
  totalFloors: number;
  totalRooms: number;
  yearBuilt?: number;
  ownerId: Types.ObjectId; 
  description?: string;
  utilities?: string[];
  area?: number;
  defaultRoomPrice?: number;
  defaultElectricityUnitPrice?: number;
  defaultWaterUnitPrice?: number;
  defaultInternetFee?: number;
  defaultParkingFee?: number;
  defaultServiceFee?: number;
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
    yearBuilt: { type: Number, required: false },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "" },
    utilities: { type: [String], default: [] },
    area: { type: Number, default: 0 },
    defaultRoomPrice: { type: Number },
    defaultElectricityUnitPrice: { type: Number },
    defaultWaterUnitPrice: { type: Number },
    defaultInternetFee: { type: Number, default: 0 },
    defaultParkingFee: { type: Number, default: 0 },
    defaultServiceFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IBuilding>("Building", buildingSchema);