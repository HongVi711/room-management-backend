import { Request, Response, NextFunction } from "express";
import { ROLE } from "../utils/app.constants";

export interface JwtPayload {
  id: string;
  role: number;
  iat?: number;
  exp?: number;
}

export const requireRole = (roles: ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Role không hợp lệ" });
    }

    next();
  };
};
