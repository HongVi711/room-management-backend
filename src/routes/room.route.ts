import { Router } from "express";
import {
  updateRoomController,
  // deleteRoomController,
  getAllRoomsController,
  getRoomByIdController,
  getOccupiedRoomsController,
  getRoomByUserIdController,
  getRoomsWithMeterReadingsController,
  deleteRoomController,
} from "../controllers/room.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { UpdateRoomDto } from "../dtos/room.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { ROLE } from "../utils/app.constants";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getAllRoomsController,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  validateDto(UpdateRoomDto),
  updateRoomController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin]),
  deleteRoomController,
);

router.get(
  "/occupied",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getOccupiedRoomsController,
);

router.get(
  "/meter-reading",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getRoomsWithMeterReadingsController,
);

router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager]),
  getRoomByIdController,
);

router.get(
  "/tenant/:userId",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.manager, ROLE.noRole]),
  getRoomByUserIdController,
);

export default router;
