export enum ROLE {
  noRole = 0,
  admin = 1,
  manager = 2,
}

export const TOKEN_EXPIRES_IN = "7d";

export enum ROOMSTATUS {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

export enum TenantStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  OVERDUE = "overdue",
}
