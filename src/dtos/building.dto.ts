import { IsString, IsNumber, IsEmail, IsOptional, IsArray } from "class-validator";

export class CreateBuildingDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  district!: string;

  @IsString()
  city!: string;

  @IsNumber()
  totalFloors!: number;

  @IsNumber()
  totalRooms!: number;

  @IsNumber()
  yearBuilt!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  utilities?: string[];
}

export class UpdateBuildingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  totalFloors?: number;

  @IsOptional()
  @IsNumber()
  totalRooms?: number;

  @IsOptional()
  @IsNumber()
  yearBuilt?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  utilities?: string[];
}
