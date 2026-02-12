import { Request, Response } from "express";
import { UserService, getUserById, getAllUsers } from "../services/user.service";
import { ROLE } from "../utils/app.constants";

export const createUser = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const frontFile = files?.cccdFront?.[0];
    const backFile = files?.cccdBack?.[0];

    if (!frontFile || !backFile) {
      return res.status(400).json({
        message: "CCCD front and back images are required",
      });
    }

    const newUser = await UserService({
      ...req.body,
      password: req.body.phone as string,
      cccdFront: frontFile,
      cccdBack: backFile,
    });

    const { password, ...userResponse } = newUser.toObject();

    return res.status(201).json({
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    // Check quyền truy cập
    if (currentUser.role === ROLE.TENANT && currentUser.id !== id) {
      return res.status(403).json({
        message: "You can only view your own profile",
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { password, ...userResponse } = user.toObject();

    return res.status(200).json({
      message: "User retrieved successfully",
      data: userResponse,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
