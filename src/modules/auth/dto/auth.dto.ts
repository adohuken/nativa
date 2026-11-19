import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'El formato de correo no es válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsString()
  nativeLanguageCode!: string; // Ej: 'es'

  @IsString()
  targetLanguageCode!: string; // Ej: 'en'

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @IsEmail({}, { message: 'El formato de correo no es válido' })
  email!: string;

  @IsString()
  password!: string;
}
