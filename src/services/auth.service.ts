import User from "../models/user.model";
import { signToken } from "../utils/jwt.util";
import { ROLE } from "../utils/app.constants";
import { RegisterDto } from "../dtos/auth.dto";
import { toUserResponse } from "../mappers/user.mapper";
import bcrypt from "bcryptjs";


export const register = async (data: RegisterDto) => {
  const existed = await User.findOne({ email: data.email });
  if (existed) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role: ROLE.TENANT,
  });

  return toUserResponse(user);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  return { 
    user: toUserResponse(user), 
    token 
  };
};