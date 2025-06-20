import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoUsuario } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fatec.sp.gov.br',
    format: 'email',
  })
  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial',
  })
  senha: string;

  @ApiProperty({
    description: 'Tipo de usuário no sistema',
    enum: TipoUsuario,
    example: TipoUsuario.Docente,
  })
  @IsEnum(TipoUsuario, {
    message:
      'Tipo de usuário inválido. Deve ser um dos seguintes: Administrador, CPS, Regional, Diretor, Coordenador, Administrativo, Docente',
  })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  tipo_usuario: TipoUsuario;
}
