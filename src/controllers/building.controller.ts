import { Request, Response } from "express";
import {
  createBuilding,
  getBuildingById,
  getBuildingsByOwner,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
} from "../services/building.service";
import { ROLE } from "../utils/app.constants";
import { IBuilding } from "../models/building.model";

export const createBuildingController = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const buildingData = {
      ...req.body,
      ownerId: currentUser.id, // Set owner to current user
    };

    const building = await createBuilding(buildingData);

    return res.status(201).json({
      message: "Building created successfully",
      data: building,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getBuildingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid building id",
      });
    }

    const building = await getBuildingById(id);

    if (!building) {
      return res.status(404).json({
        message: "Building not found",
      });
    }

    // Check quyền truy cập
    if (currentUser.role === ROLE.TENANT) {
      return res.status(403).json({
        message: "Tenants cannot view building details",
      });
    }

    // OWNER có thể xem bất kỳ building nào
    return res.status(200).json({
      message: "Building retrieved successfully",
      data: building,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllBuildingsController = async (req: Request, res: Response) => {
  try {
    const { name, address, district, city, page, limit } = req.query;

    const searchParams: {
      name?: string;
      address?: string;
      district?: string;
      city?: string;
    } = {};

    if (typeof name === "string") {
      searchParams.name = name;
    }

    if (typeof address === "string") {
      searchParams.address = address;
    }

    if (typeof district === "string") {
      searchParams.district = district;
    }

    if (typeof city === "string") {
      searchParams.city = city;
    }

    const paginationParams: {
      page?: number;
      limit?: number;
    } = {};

    if (typeof page === "string") {
      paginationParams.page = parseInt(page, 10);
    }

    if (typeof limit === "string") {
      paginationParams.limit = parseInt(limit, 10);
    }

    const result = await getAllBuildings(searchParams, paginationParams);

    return res.status(200).json({
      message: "All buildings retrieved successfully",
      data: result.buildings,
      pagination: result.pagination,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBuildingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid building id",
      });
    }

    const building = await updateBuilding(id, req.body, currentUser.id);

    if (!building) {
      return res.status(404).json({
        message: "Building not found or you don't own this building",
      });
    }

    return res.status(200).json({
      message: "Building updated successfully",
      data: building,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteBuildingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid building id",
      });
    }

    const building = await deleteBuilding(id, currentUser.id);

    if (!building) {
      return res.status(404).json({
        message: "Building not found or you don't own this building",
      });
    }

    return res.status(200).json({
      message: "Building deleted successfully",
      data: building,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
