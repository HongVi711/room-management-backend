import { Router } from "express";
import {
  updateRoomController,
  // deleteRoomController,
  getAllRoomsController,
  getRoomByIdController,
  getOccupiedRoomsController,
  getRoomByUserIdController,
  getRoomsWithMeterReadingsController,
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
  requireRole([ROLE.admin]),
  getAllRoomsController,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin]),
  validateDto(UpdateRoomDto),
  updateRoomController,
);

// router.delete(
//   "/:id",
//   authMiddleware,
//   requireRole([ROLE.OWNER]),
//   deleteRoomController,
// );

router.get(
  "/occupied",
  authMiddleware,
  requireRole([ROLE.admin]),
  getOccupiedRoomsController,
);

router.get(
  "/meter-reading",
  authMiddleware,
  requireRole([ROLE.admin]),
  getRoomsWithMeterReadingsController,
);

router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.noRole]),
  getRoomByIdController,
);

router.get(
  "/tenant/:userId",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.noRole]),
  getRoomByUserIdController,
);

export default router;
