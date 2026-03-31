// users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export enum UserRole {
  CREATOR = 'creator',
  USER = 'user',
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
