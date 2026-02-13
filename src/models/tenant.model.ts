import { Schema, model, Document, Types } from "mongoose";
import { TenantStatus } from "../utils/app.constants";

export interface ITenant extends Document {
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  moveInDate: Date;
  contractEndDate: Date;
  status: TenantStatus;
  emergencyContact?: string;
}

const tenantSchema = new Schema<ITenant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    moveInDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [ TenantStatus.ACTIVE, TenantStatus.INACTIVE],
      default: TenantStatus.ACTIVE,
    },
    emergencyContact: String,
  },
  { timestamps: true } 
);

export default model<ITenant>("Tenant", tenantSchema);