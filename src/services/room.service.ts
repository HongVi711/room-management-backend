import Room, { IRoom } from "../models/room.model";
import { CreateRoomDto, UpdateRoomDto } from "../dtos/room.dto";
import { getBuildingById } from "./building.service";
import { ROOMSTATUS } from "../utils/app.constants";
import { Types } from "mongoose";

export const createRoom = async (data: CreateRoomDto): Promise<IRoom> => {
  const room = await Room.create(data);
  return room;
};

export const updateRoom = async (
  roomId: string,
  data: UpdateRoomDto,
  ownerId: string
): Promise<IRoom | null> => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  const building = await getBuildingById(room.buildingId.toString());
  if (!building || building.ownerId.toString() !== ownerId) return null;

  const updatedRoom = await Room.findByIdAndUpdate(roomId, data, { new: true });
  return updatedRoom;
};

export const deleteRoom = async (roomId: string, ownerId: string): Promise<IRoom | null> => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  if (room.currentTenant) {
    throw new Error("Cannot delete room that has a tenant");
  }

  const building = await getBuildingById(room.buildingId.toString());
  if (!building || building.ownerId.toString() !== ownerId) return null;

  const deletedRoom = await Room.findByIdAndDelete(roomId);
  return deletedRoom;
};

export const assignTenant = async (roomId: string, userId: string, ownerId: string): Promise<IRoom | null> => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  const building = await getBuildingById(room.buildingId.toString());
  if (!building || building.ownerId.toString() !== ownerId) return null;

  if (room.status !== ROOMSTATUS.AVAILABLE) {
    throw new Error("Room is not available for assignment");
  }

  // Assign user to room
  room.currentTenant = new Types.ObjectId(userId);
  room.status = ROOMSTATUS.OCCUPIED;
  await room.save();

  return room;
};
