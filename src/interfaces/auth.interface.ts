import { ROLE } from "../utils/app.constants";

// --- OUTPUT INTERFACES ---
export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: ROLE;
  phone?: string;
  cccd?: string;
  cccdImages: {
    front: string;
    back: string;
  };
  createdAt: string;
  updatedAt: string;
}
