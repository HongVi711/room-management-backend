import Room, { IRoom } from "../models/room.model";
import { UpdateRoomDto } from "../dtos/room.dto";
import { getBuildingById } from "./building.service";
import { ROOMSTATUS, TenantStatus } from "../utils/app.constants";
import { Types } from "mongoose";
import Tenant from "../models/tenant.model";

export const updateRoom = async (
  roomId: string,
  data: UpdateRoomDto,
  ownerId: string,
): Promise<IRoom | null> => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  const building = await getBuildingById(room.buildingId.toString());
  if (!building || building.ownerId.toString() !== ownerId) return null;

  const updatedRoom = await Room.findByIdAndUpdate(roomId, data, { new: true });
  return updatedRoom;
};

export const deleteRoom = async (
  roomId: string,
  ownerId: string,
): Promise<IRoom | null> => {
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

export const assignTenant = async (
  roomId: string,
  userId: string,
  ownerId: string,
): Promise<IRoom | null> => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  const building = await getBuildingById(room.buildingId.toString());
  if (!building || building.ownerId.toString() !== ownerId) return null;

  if (room.status !== ROOMSTATUS.AVAILABLE) {
    throw new Error("Room is not available for assignment");
  }

  // Create tenant record with contract information
  await Tenant.create({
    userId: new Types.ObjectId(userId),
    roomId: new Types.ObjectId(roomId),
    moveInDate: new Date(), // Current date
    contractEndDate: null, // To be updated later
    emergencyContact: "", // To be updated later
    status: TenantStatus.ACTIVE,
  });

  // Assign user to room
  room.currentTenant = new Types.ObjectId(userId);
  room.status = ROOMSTATUS.OCCUPIED;
  await room.save();

  return room;
};

export const getAllRooms = async (
  searchParams?: {
    number?: string;
    buildingId?: string;
    floor?: number;
    status?: ROOMSTATUS;
  },
  pagination?: {
    page?: number;
    limit?: number;
  },
) => {
  let query: any = {};

  // Build search query
  if (searchParams?.number) {
    query.number = { $regex: searchParams.number, $options: "i" };
  }

  if (searchParams?.buildingId) {
    query.buildingId = new Types.ObjectId(searchParams.buildingId);
  }

  if (searchParams?.floor !== undefined) {
    query.floor = searchParams.floor;
  }

  if (searchParams?.status) {
    query.status = searchParams.status;
  }

  // Pagination settings
  const page = Math.max(1, pagination?.page || 1);
  const limit = Math.min(100, Math.max(1, pagination?.limit || 10));
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const total = await Room.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Get paginated results
  const rooms = await Room.find(query)
    .populate("buildingId", "name")
    .populate("currentTenant", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
