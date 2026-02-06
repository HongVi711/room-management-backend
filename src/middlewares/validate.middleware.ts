import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true, // loại bỏ field thừa
      forbidNonWhitelisted: true, // cấm field không khai báo
    });

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();

      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }

    req.body = dto;
    next();
  };
};
