export enum ROLE {
  TENANT = 0,
  OWNER = 1,
}

export const TOKEN_EXPIRES_IN = "7d";

export enum ROOMSTATUS {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

export enum TenantStatus {
   ACTIVE = "active",
   INACTIVE = "inactive"
};

export enum PaymentStatus {
   PAID = "paid",
   PENDING = "pending",
   OVERDUE = "overdue",
};

