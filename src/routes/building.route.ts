import { Router } from "express";
import {
  createBuildingController,
  getBuildingController,
  getAllBuildingsController,
  updateBuildingController,
  deleteBuildingController,
} from "../controllers/building.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { CreateBuildingDto, UpdateBuildingDto } from "../dtos/building.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { ROLE } from "../utils/app.constants";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole([ROLE.admin]),
  validateDto(CreateBuildingDto),
  createBuildingController,
);
router.get(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin, ROLE.noRole]),
  getBuildingController,
);

router.get(
  "/",
  authMiddleware,
  requireRole([ROLE.admin]),
  getAllBuildingsController,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin]),
  validateDto(UpdateBuildingDto),
  updateBuildingController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([ROLE.admin]),
  deleteBuildingController,
);

export default router;
