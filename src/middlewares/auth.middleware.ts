import { Request, Response, NextFunction } from "express";
import TokenBlacklist from '../models/tokenBlacklist.model'
import { verifyToken } from "../utils/jwt.util";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token revoked" });
  }
  
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
