import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import { ROLE } from "../utils/app.constants";

interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: ROLE;
  cccd?: string;
  cccdFront: Express.Multer.File;
  cccdBack: Express.Multer.File;
}

export const UserService = async (data: CreateUserInput) => {
  const { email, password, phone, cccd, cccdFront, cccdBack } = data;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email đã tồn tại");
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new Error("Số điện thoại đã tồn tại");
    }
  }

  if (cccd) {
    const existingCccd = await User.findOne({ cccd });
    if (existingCccd) {
      throw new Error("Số CCCD đã tồn tại");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...data,
    password: hashedPassword,
    role: data.role ?? ROLE.TENANT,
    cccdImages: {
      front: {
        url: cccdFront.path,       
        publicId: cccdFront.filename
      },
      back: {
        url: cccdBack.path,
        publicId: cccdBack.filename
      },
    },
  });


  return newUser;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User không tồn tại");
  }
  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};