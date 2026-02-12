import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// --- INPUT DTOs ---
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}