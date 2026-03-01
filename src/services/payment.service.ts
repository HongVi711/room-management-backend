import paymentModel, { IPayment, PaymentStatus } from "../models/payment.model";
import Room from "../models/room.model";
import { ROLE } from "../utils/app.constants";
import { Types } from "mongoose";

interface CreatePaymentInput {
  tenantId: string;
  roomId: string;
  month: string;
  electricityPrevious: number;
  electricityCurrent: number;
  electricityAmount: number;
  waterPrevious: number;
  waterCurrent: number;
  waterAmount: number;
  otherFee?: number;
  amount: number;
  dueDate: Date;
  status: string;
  notes?: string;
}

interface GetPaymentsParams {
  status?: string;
  month?: string;
  tenantId?: string;
  page?: number;
  limit?: number;
}

export const createPayment = async (data: CreatePaymentInput) => {
  // Không cần lấy Room để tính giá, frontend đã cung cấp đầy đủ
  const paymentData: any = {
    tenantId: new Types.ObjectId(data.tenantId),
    roomId: new Types.ObjectId(data.roomId),
    month: data.month,
    electricityPrevious: data.electricityPrevious,
    electricityCurrent: data.electricityCurrent,
    electricityAmount: data.electricityAmount,
    waterPrevious: data.waterPrevious,
    waterCurrent: data.waterCurrent,
    waterAmount: data.waterAmount,
    otherFee: data.otherFee || 0,
    amount: data.amount,
    dueDate: data.dueDate,
    status: data.status,
  };

  if (data.notes) {
    paymentData.notes = data.notes;
  }

  const payment = await paymentModel.create(paymentData);

  return payment;
};

export const getPayments = async (params?: GetPaymentsParams, userRole?: number, userId?: string) => {
  const query: any = {};

  // Filter by user role
  if (userRole === ROLE.TENANT && userId) {
    query.tenantId = new Types.ObjectId(userId);
  } else if (params?.tenantId) {
    query.tenantId = new Types.ObjectId(params.tenantId);
  }

  // Filter by status
  if (params?.status) {
    query.status = params.status;
  }

  // Filter by month
  if (params?.month) {
    query.month = params.month;
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const total = await paymentModel.countDocuments(query);
  const payments = await paymentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

  return {
    total,
    page,
    limit,
    data: payments,
  };
};

export const getPaymentById = async (paymentId: string, userRole?: number, userId?: string) => {
  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Tenant can only view their own payments
  if (userRole === ROLE.TENANT && payment.tenantId.toString() !== userId) {
    throw new Error("Access denied");
  }

  return payment;
};

export const updatePayment = async (paymentId: string, data: Partial<IPayment>) => {
  const payment = await paymentModel.findByIdAndUpdate(paymentId, data, { new: true });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const markAsPaid = async (paymentId: string, userRole?: number, userId?: string) => {
  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Tenant can only mark their own payments as paid
  if (userRole === ROLE.TENANT && payment.tenantId.toString() !== userId) {
    throw new Error("Access denied");
  }

  payment.status = PaymentStatus.PAID;
  payment.paidDate = new Date();
  await payment.save();

  return payment;
};

export const deletePayment = async (paymentId: string) => {
  const payment = await paymentModel.findByIdAndDelete(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};
