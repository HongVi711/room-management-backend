import { Request, Response } from "express";
import { buildExportData } from "../services/payment-export.service";
import { streamZipToResponse } from "../services/zip.service";

export const exportPaymentsController = async (req: Request, res: Response) => {
  try {
    const { invoiceIds } = req.body;

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách invoice IDs là bắt buộc",
      });
    }

    const data = await buildExportData(invoiceIds);
    await streamZipToResponse(data, res);
  } catch (error) {
    console.error("Error exporting payments:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Lỗi khi export payments",
    });
  }
};
