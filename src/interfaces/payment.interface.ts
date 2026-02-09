import { PaymentStatus } from "../utils/app.constants";

export interface IPaymentResponse {
  id: string;
  tenantId: string;
  roomId: string;
  amount: number;
  month: string;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}
