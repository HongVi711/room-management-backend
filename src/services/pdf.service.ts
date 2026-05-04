import { Browser } from "puppeteer-core";
import { generatePaymentPDFContent } from "../templates/payment-receipt.template";
import { PaymentExportData } from "./payment-export.service";

export const generatePaymentPDF = async (
  browser: Browser,
  payment: PaymentExportData,
): Promise<Buffer> => {
  const page = await browser.newPage();

  try {
    const html = generatePaymentPDFContent(payment);

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdf = await page.pdf({ format: "A4" });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
};
