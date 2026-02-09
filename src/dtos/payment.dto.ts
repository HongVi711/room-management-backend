import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from "class-validator";
import { PaymentStatus } from "../utils/app.constants";

export class CreatePaymentDto {
  @IsString()
  tenantId!: string;

  @IsString()
  roomId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  month!: string; 

  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
