import mongoose, { Schema, model } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}

export interface IPayment extends mongoose.Document {
  tenantId: string;
  roomId: string;
  month: string;

  roomFee: number;

  electricityUnitPrice: number;
  electricityPrevious: number;
  electricityCurrent: number;
  electricityAmount: number;

  waterUnitPrice: number;
  waterPrevious: number;
  waterCurrent: number;
  waterAmount: number;

  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  otherFee?: number;

  amount: number;

  dueDate: string;
  paidDate?: string;

  status: PaymentStatus;
  notes?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    tenantId: { type: String, required: true, index: true },
    roomId: { type: String, required: true, index: true },

    month: { type: String, required: true }, // YYYY-MM

    roomFee: { type: Number, required: true },

    electricityUnitPrice: { type: Number, required: true },
    electricityPrevious: { type: Number, required: true },
    electricityCurrent: { type: Number, required: true },
    electricityAmount: { type: Number, required: false }, // Auto-calculated

    waterUnitPrice: { type: Number, required: true },
    waterPrevious: { type: Number, required: true },
    waterCurrent: { type: Number, required: true },
    waterAmount: { type: Number, required: false }, // Auto-calculated

    internetFee: { type: Number, default: 0 },
    parkingFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    otherFee: { type: Number, default: 0 },

    amount: { type: Number, required: false }, // Auto-calculated

    dueDate: { type: String, required: true },
    paidDate: { type: String },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

paymentSchema.pre("save", async function (this: IPayment) {
  if (this.electricityCurrent < this.electricityPrevious) {
    throw new Error("Electricity current must be >= previous");
  }

  this.electricityAmount =
    (this.electricityCurrent - this.electricityPrevious) *
    this.electricityUnitPrice;

  this.waterAmount =
    (this.waterCurrent - this.waterPrevious) * this.waterUnitPrice;

  this.amount =
    this.roomFee +
    this.electricityAmount +
    this.waterAmount +
    (this.internetFee ?? 0) +
    (this.parkingFee ?? 0) +
    (this.serviceFee ?? 0) +
    (this.otherFee ?? 0);
});

export default model<IPayment>("Payment", paymentSchema);
