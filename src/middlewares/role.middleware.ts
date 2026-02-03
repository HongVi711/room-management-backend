import { Request, Response, NextFunction } from "express";
import { ROLE } from "../utils/app.constants";

export const requireRole = (roles: ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
