import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { TipoUsuario } from '@prisma/client';

export class RegisterDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial',
  })
  senha: string;

  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido' })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  tipo_usuario: TipoUsuario;
}