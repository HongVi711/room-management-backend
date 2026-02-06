import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateDto(RegisterDto), AuthController.register);
router.post("/login", validateDto(LoginDto), AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
