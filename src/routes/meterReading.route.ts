import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createMeterReadingController,
  getMeterReadingsController,
  getMeterReadingByIdController,
  updateMeterReadingController,
  deleteMeterReadingController,
  bulkUpsertMeterReadingsController,
} from "../controllers/meterReading.controller";
import { ROLE } from "../utils/app.constants";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  createMeterReadingController,
);
router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getMeterReadingsController,
);
router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getMeterReadingByIdController,
);
router.put(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  updateMeterReadingController,
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  deleteMeterReadingController,
);

// POST /api/meter-readings/bulk - Bulk upsert meter readings
router.post(
  "/bulk",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  bulkUpsertMeterReadingsController,
);

export default router;
