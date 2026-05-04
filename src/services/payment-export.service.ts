import Room from "../models/room.model";
import { Types } from "mongoose";
const archiver = require("archiver");
import puppeteer from "puppeteer-core";
const chromium = require("@sparticuz/chromium") as ChromiumType;
import { generatePaymentPDFContent } from "../templates/payment-receipt.template";

type ChromiumType = {
  args: string[];
  defaultViewport: any;
  executablePath: () => Promise<string>;
  headless: boolean;
};

export interface PaymentExportData {
  invoiceId: string;
  paymentId: string;
  tenantName: string;
  roomName: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  notes?: string;
  rentAmount?: number;
  electricityCost?: number;
  waterCost?: number;
  internetFee?: number;
  parkingFee?: number;
  otherFee?: number;
  livingFee?: number;
  electricityPrevious?: number;
  electricityCurrent?: number;
  electricityUsage?: number;
  electricityUnitPrice?: number;
  waterPrevious?: number;
  waterCurrent?: number;
  waterUsage?: number;
  isWaterPricePerPerson?: boolean;
  memberCount?: number;
  vehicleCount?: number;
  waterUnitPrice?: number;
  month?: number;
  year?: number;
}

export const buildExportData = async (invoiceIds: string[]) => {
  const Invoice = require("../models/invoice.model").default;

  const validInvoiceIds = invoiceIds.filter((id) => Types.ObjectId.isValid(id));

  if (validInvoiceIds.length === 0) {
    throw new Error("Không có invoice ID hợp lệ");
  }

  const invoices = await Invoice.find({ _id: { $in: validInvoiceIds } })
    .populate({
      path: "roomId",
      populate: {
        path: "buildingId",
        select: "name",
      },
    })
    .lean();

  if (!invoices.length) return [];

  const roomIds = invoices.map((i: any) => i.roomId?._id).filter(Boolean);

  const rooms = await Room.find({ _id: { $in: roomIds } })
    .select("members waterPricePerPerson waterPricePerCubicMeter number")
    .lean();

  const roomMap = new Map(rooms.map((r: any) => [r._id.toString(), r]));

  const result: any[] = [];

  for (const invoice of invoices) {
    const roomId = invoice.roomId;
    if (!roomId) continue;

    const room = roomMap.get(roomId._id.toString());

    const members = room?.members || [];

    let tenantName = "Unknown";
    if (invoice.tenantId && members.length) {
      const tenant = members.find(
        (m: any) => m._id.toString() === invoice.tenantId.toString(),
      );
      if (tenant) tenantName = tenant.name;
    }

    const waterCost =
      room?.waterPricePerPerson > 0
        ? ((invoice as any).waterCost ?? 0) * members.length
        : ((invoice as any).waterCost ?? 0);

    const vehicleCount =
      members.filter((m: any) => m.licensePlate?.trim()).length || 0;

    const amount =
      waterCost +
      ((invoice as any).rentAmount ?? 0) +
      ((invoice as any).electricityCost ?? 0) +
      ((invoice as any).internetFee ?? 0) +
      ((invoice as any).parkingFee ?? 0) * vehicleCount +
      ((invoice as any).otherFee ?? 0) +
      ((invoice as any).livingFee ?? 0);

    result.push({
      invoiceId: invoice._id.toString(),
      paymentId: invoice._id.toString(),
      tenantName,
      roomName: `${roomId.buildingId?.name || "Unknown"} - ${room?.number || "Unknown"}`,

      amount,
      paymentDate: invoice.createdAt || new Date(),
      notes: invoice.notes,

      rentAmount: (invoice as any).rentAmount,
      electricityCost: (invoice as any).electricityCost,
      waterCost,

      internetFee: (invoice as any).internetFee,
      parkingFee: (invoice as any).parkingFee,
      otherFee: (invoice as any).otherFee,
      livingFee: (invoice as any).livingFee,

      electricityPrevious: (invoice as any).electricityPrevious,
      electricityCurrent: (invoice as any).electricityCurrent,
      electricityUsage: (invoice as any).electricityUsage,
      electricityUnitPrice: (invoice as any).electricityUnitPrice,

      waterPrevious: (invoice as any).waterPrevious,
      waterCurrent: (invoice as any).waterCurrent,
      waterUsage: (invoice as any).waterUsage,

      memberCount: members.length,
      vehicleCount,

      waterUnitPrice:
        room?.waterPricePerCubicMeter !== 0
          ? room?.waterPricePerCubicMeter
          : (room?.waterPricePerPerson ?? 0),

      isWaterPricePerPerson: room?.waterPricePerPerson > 0,

      month:
        (invoice as any).month ||
        new Date(invoice.createdAt || new Date()).getMonth() + 1,

      year:
        (invoice as any).year ||
        new Date(invoice.createdAt || new Date()).getFullYear(),
    });
  }

  return result;
};
