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

export const getAllUsers = async (searchParams?: {
  email?: string;
  name?: string;
  phone?: string;
}, pagination?: {
  page?: number;
  limit?: number;
}) => {
  let query: any = {};

  // Build search query
  if (searchParams?.email) {
    query.email = { $regex: searchParams.email, $options: 'i' }; 
  }

  if (searchParams?.name) {
    query.name = { $regex: searchParams.name, $options: 'i' };
  }

  if (searchParams?.phone) {
    query.phone = { $regex: searchParams.phone, $options: 'i' };
  }

  const page = Math.max(1, pagination?.page || 1);
  const limit = Math.min(100, Math.max(1, pagination?.limit || 10)); 
  const skip = (page - 1) * limit;

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const users = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(limit);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};