/* ======================
   AUTH ROLES
====================== */
export enum ROLE {
  TENANT = 0,
  OWNER = 1,
}

/* ======================
   AUTH TOKEN
====================== */
export const TOKEN_EXPIRES_IN = "7d";

/* ======================
   ROOM STATUS
====================== */
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

