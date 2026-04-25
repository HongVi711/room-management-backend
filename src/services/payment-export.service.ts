import PaymentTransaction from "../models/payment-transaction.model";
import Room from "../models/room.model";
import { Types } from "mongoose";
const archiver = require("archiver");
import puppeteer from "puppeteer";
import { generatePaymentPDFContent } from "../templates/payment-receipt.template";

export interface PaymentExportData {
  invoiceId: string;
  paymentId: string;
  tenantName: string;
  roomName: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  notes?: string;
  // Detailed fee breakdown
  rentAmount?: number;
  electricityCost?: number;
  waterCost?: number;
  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  otherFee?: number;
  livingFee?: number;
  electricityPrevious?: number;
  electricityCurrent?: number;
  electricityUsage?: number;
  electricityUnitPrice?: number;
  waterPrevious?: number;
  waterCurrent?: number;
  waterUsage?: number;
  waterUnitPrice?: number;
  month?: number;
  year?: number;
}

export const exportInvoicesAsZip = async (invoiceIds: string[]) => {
  try {
    // 1. Validate invoice IDs
    const validInvoiceIds = invoiceIds.filter((id) =>
      Types.ObjectId.isValid(id),
    );
    if (validInvoiceIds.length === 0) {
      throw new Error("Không có invoice ID hợp lệ");
    }

    // 2. Get invoices directly
    console.log("Searching for invoices with IDs:", validInvoiceIds);

    const Invoice = require("../models/invoice.model").default;
    const invoices = await Invoice.find({ _id: { $in: validInvoiceIds } })
      .populate({
        path: "roomId",
        populate: {
          path: "buildingId",
          select: "name",
        },
      })
      .lean();

    console.log("Found invoices:", invoices.length);

    if (invoices.length === 0) {
      throw new Error(
        `Không tìm thấy invoices nào với IDs: ${validInvoiceIds.join(", ")}`,
      );
    }

    // 3. Prepare export data from invoices
    const exportData: PaymentExportData[] = [];

    for (const invoice of invoices) {
      const roomId = invoice.roomId as any;
      if (!roomId) continue;

      // Get tenant info from room members
      let tenantName = "Unknown";
      if (invoice.tenantId) {
        const room = await Room.findById(roomId._id).select("members").lean();
        if (room && room.members) {
          const tenant = room.members.find(
            (member: any) =>
              member._id.toString() === invoice.tenantId.toString(),
          );
          if (tenant) {
            tenantName = tenant.name;
          }
        }
      }

      const invoiceData: PaymentExportData = {
        invoiceId: invoice._id.toString(),
        paymentId: invoice._id.toString(), // Use invoice ID as payment ID
        tenantName,
        roomName: `${roomId.buildingId?.name || "Unknown"} - ${roomId.number || "Unknown"}`,
        amount: invoice.totalAmount || 0,
        paymentDate: invoice.createdAt || new Date(),
        paymentMethod: invoice.paymentMethod || "Tiền mặt",
        notes: invoice.notes,
        // Detailed fee breakdown from invoice
        rentAmount: (invoice as any).rentAmount,
        electricityCost: (invoice as any).electricityCost,
        waterCost: (invoice as any).waterCost,
        internetFee: (invoice as any).internetFee,
        parkingFee: (invoice as any).parkingFee,
        serviceFee: (invoice as any).serviceFee,
        otherFee: (invoice as any).otherFee,
        livingFee: (invoice as any).livingFee,
        electricityPrevious: (invoice as any).electricityPrevious,
        electricityCurrent: (invoice as any).electricityCurrent,
        electricityUsage: (invoice as any).electricityUsage,
        electricityUnitPrice: (invoice as any).electricityUnitPrice,
        waterPrevious: (invoice as any).waterPrevious,
        waterCurrent: (invoice as any).waterCurrent,
        waterUsage: (invoice as any).waterUsage,
        waterUnitPrice: (invoice as any).waterUnitPrice,
        month:
          (invoice as any).month ||
          new Date(invoice.createdAt || new Date()).getMonth() + 1,
        year:
          (invoice as any).year ||
          new Date(invoice.createdAt || new Date()).getFullYear(),
      };

      exportData.push(invoiceData);
    }

    // 4. Generate export data
    const exportBuffer = await createPaymentZip(exportData);

    return exportBuffer;
  } catch (error) {
    console.error("Error exporting invoices:", error);
    throw error;
  }
};

const createPaymentZip = async (
  payments: PaymentExportData[],
): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const archive = archiver("zip", { zlib: { level: 9 } });
      const buffers: Buffer[] = [];

      archive.on("data", (data: Buffer) => {
        buffers.push(data);
      });

      archive.on("error", (err: Error) => {
        reject(err);
      });

      archive.on("end", () => {
        const zipBuffer = Buffer.concat(buffers);
        resolve(zipBuffer);
      });

      // Generate PDFs and add to ZIP
      for (const payment of payments) {
        try {
          const pdfBuffer = await generatePaymentPDF(payment);
          const fileName = `payment_${payment.paymentId}_${payment.tenantName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
          archive.append(pdfBuffer, { name: fileName });
        } catch (pdfError) {
          console.error(
            `Error generating PDF for payment ${payment.paymentId}:`,
            pdfError,
          );
        }
      }

      archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
};

const generatePaymentPDF = async (
  payment: PaymentExportData,
): Promise<Buffer> => {
  const html = generatePaymentPDFContent(payment);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfUint8Array = await page.pdf({ format: "A4" });
  await browser.close();
  return Buffer.from(pdfUint8Array);
};
