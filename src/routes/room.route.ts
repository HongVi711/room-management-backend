import { Router } from "express";
import { updateRoomController, deleteRoomController, assignTenantController, getAllRoomsController } from "../controllers/room.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { UpdateRoomDto, AssignTenantDto } from "../dtos/room.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { ROLE } from "../utils/app.constants";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.OWNER]),
  getAllRoomsController,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([ROLE.OWNER]),
  validateDto(UpdateRoomDto),
  updateRoomController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([ROLE.OWNER]),
  deleteRoomController,
);

router.post(
  "/:id/assign-tenant",
  authMiddleware,
  requireRole([ROLE.OWNER]),
  validateDto(AssignTenantDto),
  assignTenantController,
);

export default router;
