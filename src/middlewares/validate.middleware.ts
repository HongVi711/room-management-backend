import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";

const cleanupFiles = async (files: any) => {
  if (!files) return;
  const fileArray = [...(files.cccdFront || []), ...(files.cccdBack || [])];
  for (const file of fileArray) {
    if (file.filename) {
      await cloudinary.uploader.destroy(file.filename);
    }
  }
};

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(DtoClass, req.body);

    const errors = await validate(dtoObj);

    if (errors.length > 0) {
      await cleanupFiles(req.files);

      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    req.body = dtoObj;
    next();
  };
};