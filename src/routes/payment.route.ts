import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  markAsPaid,
  updatePayment,
} from "../controllers/payment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { ROLE } from "../utils/app.constants";

const router = Router();

/**
 * TENANT → xem hóa đơn của mình
 * OWNER → xem tất cả hóa đơn
 */
router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.OWNER, ROLE.TENANT]),
  getPayments,
);

/**
 * OWNER tạo hóa đơn
 */
router.post("/", authMiddleware, requireRole([ROLE.OWNER]), createPayment);

/**
 * Xem chi tiết hóa đơn
 * TENANT chỉ xem hóa đơn của mình
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.OWNER, ROLE.TENANT]),
  getPaymentById,
);

/**
 * OWNER cập nhật hóa đơn
 */
router.put("/:id", authMiddleware, requireRole([ROLE.OWNER]), updatePayment);

/**
 * TENANT thanh toán hóa đơn
 */
router.patch(
  "/:id/pay",
  authMiddleware,
  requireRole([ROLE.TENANT]),
  markAsPaid,
);

/**
 * OWNER xóa hóa đơn
 */
router.delete("/:id", authMiddleware, requireRole([ROLE.OWNER]), deletePayment);

export default router;
