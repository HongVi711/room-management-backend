import Building, { IBuilding } from "../models/building.model";
import { CreateBuildingDto, UpdateBuildingDto } from "../dtos/building.dto";

interface CreateBuildingInput extends CreateBuildingDto {
  ownerId: string; // owner user id from auth
}

export const createBuilding = async (data: CreateBuildingInput): Promise<IBuilding> => {
  const building = await Building.create(data);
  return building;
};

export const getBuildingById = async (buildingId: string): Promise<IBuilding | null> => {
  const building = await Building.findById(buildingId);
  return building;
};

export const getBuildingsByOwner = async (ownerId: string): Promise<IBuilding[]> => {
  const buildings = await Building.find({ ownerId: ownerId });
  return buildings;
};

export const getAllBuildings = async (
  searchParams?: {
    name?: string;
    address?: string;
    district?: string;
    city?: string;
  },
  pagination?: {
    page?: number;
    limit?: number;
  }
) => {
  let query: any = {};

  // Build search query
  if (searchParams?.name) {
    query.name = { $regex: searchParams.name, $options: 'i' }; // Case insensitive
  }

  if (searchParams?.address) {
    query.address = { $regex: searchParams.address, $options: 'i' };
  }

  if (searchParams?.district) {
    query.district = { $regex: searchParams.district, $options: 'i' };
  }

  if (searchParams?.city) {
    query.city = { $regex: searchParams.city, $options: 'i' };
  }

  // Pagination settings
  const page = Math.max(1, pagination?.page || 1); // Default page 1
  const limit = Math.min(100, Math.max(1, pagination?.limit || 10)); // Default 10, max 100
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const total = await Building.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Get paginated results
  const buildings = await Building.find(query)
    .skip(skip)
    .limit(limit);

  return {
    buildings,
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

export const updateBuilding = async (
  buildingId: string,
  data: UpdateBuildingDto,
  ownerId: string
): Promise<IBuilding | null> => {
  const building = await Building.findOneAndUpdate(
    { _id: buildingId, ownerId: ownerId },
    data,
    { new: true }
  );
  return building;
};

export const deleteBuilding = async (
  buildingId: string,
  ownerId: string
): Promise<IBuilding | null> => {
  const building = await Building.findOneAndDelete({
    _id: buildingId,
    ownerId: ownerId,
  });
  return building;
};
