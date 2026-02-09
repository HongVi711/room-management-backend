import { ROOMSTATUS } from "../utils/app.constants";

export interface IRoomResponse {
  id: string;
  number: string;
  building: string;
  floor: number;
  area: number;
  price: number;
  status: ROOMSTATUS;
  currentTenant?: string;
  description?: string;
}
