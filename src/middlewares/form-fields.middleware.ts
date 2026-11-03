import { Request, Response, NextFunction } from "express";
import multer from "multer";

const parseFields = multer().none();

// Đọc các trường text của multipart/form-data và từ chối mọi file gửi kèm
export const formFieldsOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  parseFields(req, res, (error: unknown) => {
    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({
        message: "Hệ thống không còn nhận ảnh CCCD",
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  });
};
