import { Schema, model, Document, Types } from "mongoose";

export enum ExpenseCategory {
  MAINTENANCE = "maintenance",
  FURNITURE = "furniture",
  UTILITY_BILL = "utility",
  TAX = "tax",
  OTHER = "other",
}

export interface IExpense extends Document {
  buildingId: Types.ObjectId;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      default: ExpenseCategory.OTHER,
    },
    expenseDate: { type: Date, required: true },
  },
  { timestamps: true },
);

export default model<IExpense>("Expense", expenseSchema);
