import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.body.assignBuilding === undefined ||
      req.body.assignBuilding === ""
    ) {
      req.body.assignBuilding = [];
    } else if (!Array.isArray(req.body.assignBuilding)) {
      req.body.assignBuilding = [req.body.assignBuilding];
    }

    const dtoObj = plainToInstance(DtoClass, req.body);

    const errors = await validate(dtoObj);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      return res.status(400).json({
        message: "Có lỗi xảy ra trong quá trình xử lý",
        errors: messages,
      });
    }

    req.body = dtoObj;
    next();
  };
};
