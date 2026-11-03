import { ROLE } from "../utils/app.constants";

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: ROLE;
  phone?: string;
  licensePlate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: ROLE;
  licensePlate?: string;
  assignBuilding?: string[];
}
