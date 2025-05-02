import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TipoUsuario } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  nome: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  nome_usuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  senha?: string;

  @IsEnum(TipoUsuario)
  tipo_usuario: TipoUsuario;
}
