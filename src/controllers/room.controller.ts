import { Request, Response } from "express";
import { updateRoom, deleteRoom, assignTenant, getAllRooms } from "../services/room.service";
import { ROLE } from "../utils/app.constants";
import { getBuildingById } from "../services/building.service";

export const getAllRoomsController = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { number, buildingId, floor, status, page, limit } = req.query;

    // Build search params
    const searchParams: any = {};
    if (number) searchParams.number = number as string;
    if (buildingId) searchParams.buildingId = buildingId as string;
    if (floor) searchParams.floor = parseInt(floor as string);
    if (status) searchParams.status = status as string;

    // Build pagination
    const pagination: any = {};
    if (page) pagination.page = parseInt(page as string);
    if (limit) pagination.limit = parseInt(limit as string);

    const result = await getAllRooms(searchParams, pagination);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateRoomController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid room id",
      });
    }

    if (currentUser.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot update rooms",
      });
    }

    const room = await updateRoom(id, req.body, currentUser.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found or you don't own the building",
      });
    }

    return res.status(200).json({
      message: "Room updated successfully",
      data: room,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteRoomController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid room id",
      });
    }

    if (currentUser.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot delete rooms",
      });
    }

    const room = await deleteRoom(id, currentUser.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found or you don't own the building",
      });
    }

    return res.status(200).json({
      message: "Room deleted successfully",
      data: room,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const assignTenantController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid room id",
      });
    }

    if (currentUser.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot assign tenants to rooms",
      });
    }

    const room = await assignTenant(id, req.body.userId, currentUser.id, {
      moveInDate: req.body.moveInDate,
      contractEndDate: req.body.contractEndDate,
      emergencyContact: req.body.emergencyContact
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found or you don't own the building",
      });
    }

    return res.status(200).json({
      message: "Tenant assigned to room successfully",
      data: room,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
