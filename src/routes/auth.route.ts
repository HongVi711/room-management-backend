import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { LoginDto } from "../dtos/auth.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", validateDto(LoginDto), AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
