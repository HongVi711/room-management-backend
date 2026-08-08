import { Router } from "express";
import {
  getInvoicePreviewController,
  bulkCreateInvoicesController,
  getInvoicesController,
  getInvoiceByIdController,
  deleteInvoiceController,
} from "../controllers/invoice.controller";
import { ROLE } from "../utils/app.constants";
import { requireRole } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET /invoice-preview - xem trước tiền
router.get(
  "/invoice-preview",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getInvoicePreviewController,
);

// POST /bulk-create - tạo nhiều hóa đơn cùng lúc
router.post("/bulk-create", bulkCreateInvoicesController);

// GET /invoices - lấy danh sách hóa đơn
router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getInvoicesController,
);

// GET /invoices/:id - lấy chi tiết hóa đơn
router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getInvoiceByIdController,
);

// DELETE /invoices/:id - xóa hóa đơn
router.delete("/:id", deleteInvoiceController);

export default router;
