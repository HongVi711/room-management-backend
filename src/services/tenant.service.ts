import Tenant, { ITenant } from "../models/tenant.model";
import { CreateTenantDto } from "../dtos/tenant.dto";
import { TenantStatus } from "../utils/app.constants";

export const createTenant = async (data: CreateTenantDto): Promise<ITenant> => {
  const tenant = await Tenant.create(data);
  return tenant;
};

interface GetAllTenantsParams {
  status?: TenantStatus;
  userId?: string;
  roomId?: string;
  page?: number;
  limit?: number;
}

export const getAllTenants = async (params?: GetAllTenantsParams) => {
  let query: any = {};

  // Filter by status
  if (params?.status) {
    query.status = params.status;
  }

  // Filter by userId
  if (params?.userId) {
    query.userId = params.userId;
  }

  // Filter by roomId
  if (params?.roomId) {
    query.roomId = params.roomId;
  }

  const page = Math.max(1, params?.page || 1);
  const limit = Math.min(100, Math.max(1, params?.limit || 10));
  const skip = (page - 1) * limit;

  const total = await Tenant.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const tenants = await Tenant.find(query)
    .populate('userId', 'email name phone cccd cccdImages')
    .populate('roomId', 'roomNumber floor area price buildingId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    tenants,
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
