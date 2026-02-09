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

export const toRoomResponse = (room: any) => ({
  id: room._id.toString(),
  number: room.number,
  building: room.building.toString(),
  floor: room.floor,
  area: room.area,
  price: room.price,
  status: room.status,
  currentTenant: room.currentTenant?.toString(),
  description: room.description,
});
