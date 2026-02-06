import { IUser } from "../models/user.model";
import { UserResponseDto } from "../interfaces/auth.interface";

export const toUserResponse = (user: IUser): UserResponseDto => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
...(user.phone !== undefined && { phone: user.phone }),
  ...(user.cccd !== undefined && { cccd: user.cccd }),
});
