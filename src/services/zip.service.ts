import archiver from "archiver";
import pLimit from "p-limit";
import { Response } from "express";
import { generatePaymentPDF } from "./pdf.service";
import { getBrowser } from "../utils/browser";
import { PaymentExportData } from "./payment-export.service";

export const streamZipToResponse = async (
  payments: PaymentExportData[],
  res: Response,
) => {
  const browser = await getBrowser();

  const archive = archiver("zip", { zlib: { level: 9 } });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=invoices.zip");

  archive.pipe(res);

  const limit = pLimit(3);

  await Promise.all(
    payments.map((payment) =>
      limit(async () => {
        try {
          const pdf = await generatePaymentPDF(browser, payment);

          const safeTenant = payment.tenantName.replace(/[^\p{L}\p{N}]/gu, "_");
          const safeRoom = payment.roomName.replace(/[^\p{L}\p{N}]/gu, "_");

          const fileName = `${safeRoom}_${safeTenant}.pdf`;

          archive.append(pdf, { name: fileName });
        } catch (err) {
          console.error("PDF error:", err);
        }
      }),
    ),
  );

  await archive.finalize();
};
