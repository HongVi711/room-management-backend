import { Response } from "express";
import paymentModel, { PaymentStatus } from "../models/payment.model";
import { ROLE } from "../utils/app.constants";

// ===============================
// CREATE PAYMENT (OWNER)
// ===============================
export const createPayment = async (req: any, res: Response) => {
  try {
    if (req.user.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot create payments",
      });
    }

    const payment = await paymentModel.create(req.body);

    return res.status(201).json({
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create payment",
    });
  }
};

// ===============================
// GET PAYMENTS
// OWNER → all
// TENANT → only theirs
// ===============================
export const getPayments = async (req: any, res: Response) => {
  try {
    const { status, month } = req.query;

    const query: {
      tenantId?: string;
      status?: PaymentStatus;
      month?: string;
    } = {};

    if (req.user.role === ROLE.TENANT) {
      query.tenantId = req.user.id;
    }

    if (status) query.status = status as PaymentStatus;
    if (month) query.month = month as string;

    const payments = await paymentModel.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      data: payments,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
};

// ===============================
// GET PAYMENT DETAIL
// ===============================
export const getPaymentById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Invalid payment id",
      });
    }

    const payment = await paymentModel.findById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // tenant chỉ xem hóa đơn của mình
    if (req.user.role === ROLE.TENANT && payment.tenantId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json(payment);
  } catch {
    return res.status(500).json({
      message: "Failed to fetch payment",
    });
  }
};

// ===============================
// UPDATE PAYMENT (OWNER)
// ===============================
export const updatePayment = async (req: any, res: Response) => {
  try {
    if (req.user.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot update payments",
      });
    }

    const { id } = req.params;

    const payment = await paymentModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      message: "Payment updated successfully",
      data: payment,
    });
  } catch {
    return res.status(400).json({
      message: "Update failed",
    });
  }
};

// ===============================
// TENANT PAY BILL
// ===============================
export const markAsPaid = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await paymentModel.findById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // tenant chỉ trả hóa đơn của mình
    if (req.user.role === ROLE.TENANT && payment.tenantId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    payment.status = PaymentStatus.PAID;
    payment.paidDate = new Date().toISOString();

    await payment.save();

    return res.status(200).json({
      message: "Payment successful",
      data: payment,
    });
  } catch {
    return res.status(500).json({
      message: "Payment failed",
    });
  }
};

// ===============================
// DELETE PAYMENT (OWNER)
// ===============================
export const deletePayment = async (req: any, res: Response) => {
  try {
    if (req.user.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot delete payments",
      });
    }

    const { id } = req.params;

    const payment = await paymentModel.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Delete failed",
    });
  }
};
