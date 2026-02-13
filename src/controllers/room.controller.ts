import { Request, Response } from "express";
import { createRoom, updateRoom, deleteRoom, assignTenant } from "../services/room.service";
import { ROLE } from "../utils/app.constants";
import { getBuildingById } from "../services/building.service";

export const createRoomController = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { buildingId } = req.body;

    if (currentUser.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot create rooms",
      });
    }

    const building = await getBuildingById(buildingId);
    if (!building) {
      return res.status(404).json({
        message: "Building not found",
      });
    }
    if (building.ownerId.toString() !== currentUser.id) {
      return res.status(403).json({
        message: "You can only create rooms in your own buildings",
      });
    }
    const room = await createRoom(req.body);
    return res.status(201).json({
      message: "Room created successfully",
      data: room,
    });
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

    const room = await assignTenant(id, req.body.userId, currentUser.id);

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
