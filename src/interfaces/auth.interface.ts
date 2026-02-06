import { ROLE } from "../utils/app.constants";

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: ROLE;
  phone?: number;
  cccd?: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
}