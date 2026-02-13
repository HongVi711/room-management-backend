import Tenant, { ITenant } from "../models/tenant.model";
import { CreateTenantDto } from "../dtos/tenant.dto";

export const createTenant = async (data: CreateTenantDto): Promise<ITenant> => {
  const tenant = await Tenant.create(data);
  return tenant;
};
