import { TenantStatus } from "../utils/app.constants";

export interface ITenantResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  roomId: string;
  moveInDate: string;
  contractEndDate: string;
  status: TenantStatus;
  emergencyContact?: string;
}
