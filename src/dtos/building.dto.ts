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

  @IsString()
  owner!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  utilities?: string[];
}
