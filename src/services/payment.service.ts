import paymentModel, { PaymentStatus } from "../models/payment.model";
import { ROLE } from "../utils/app.constants";

interface CreatePaymentInput {
  tenantId: string;
  roomId: string;
  amount: number;
  month: string;
  dueDate: string;
  description?: string;
}

interface GetPaymentsParams {
  status?: PaymentStatus;
  month?: string;
  tenantId?: string;
}

export const createPayment = async (data: CreatePaymentInput) => {
  const payment = await paymentModel.create(data);
  return payment;
};

export const getPayments = async (params?: GetPaymentsParams, userRole?: number, userId?: string) => {
  const query: any = {};

  // Filter by user role
  if (userRole === ROLE.TENANT && userId) {
    query.tenantId = userId;
  } else if (params?.tenantId) {
    query.tenantId = params.tenantId;
  }

  // Filter by status
  if (params?.status) {
    query.status = params.status;
  }

  // Filter by month
  if (params?.month) {
    query.month = params.month;
  }

  const payments = await paymentModel.find(query).sort({ createdAt: -1 });

  return {
    count: payments.length,
    payments,
  };
};

export const getPaymentById = async (paymentId: string, userRole?: number, userId?: string) => {
  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Tenant can only view their own payments
  if (userRole === ROLE.TENANT && payment.tenantId !== userId) {
    throw new Error("Access denied");
  }

  return payment;
};

export const updatePayment = async (paymentId: string, updateData: any) => {
  const payment = await paymentModel.findByIdAndUpdate(
    paymentId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

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

  // Tenant can only pay their own bills
  if (userRole === ROLE.TENANT && payment.tenantId !== userId) {
    throw new Error("Access denied");
  }

  payment.status = PaymentStatus.PAID;
  payment.paidDate = new Date().toISOString();

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
