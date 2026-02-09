import { IsString, IsNumber, IsEnum, IsOptional, Min } from "class-validator";
import { ROOMSTATUS } from "../utils/app.constants";

export class CreateRoomDto {
  @IsString()
  number!: string;

  @IsString()
  building!: string;

  @IsNumber()
  floor!: number;

  @IsNumber()
  @Min(1)
  area!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsEnum(ROOMSTATUS)
  status!: ROOMSTATUS;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(["available", "occupied", "maintenance"])
  status?: ROOMSTATUS;

  @IsOptional()
  @IsString()
  currentTenant?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
