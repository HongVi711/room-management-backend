import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from "class-validator";
import { ROLE } from "../utils/app.constants";

export class RegisterDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6, { message: "Mật khẩu phải ít nhất 6 ký tự" })
  password!: string;

  // Nếu muốn cho phép chọn Role lúc đăng ký (optional)
  // @IsOptional()
  // @IsEnum(ROLE)
  // role?: ROLE;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}