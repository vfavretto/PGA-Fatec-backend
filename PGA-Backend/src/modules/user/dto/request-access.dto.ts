import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RequestAccessDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'O código da unidade é obrigatório' })
  @Matches(/^F\d{3}$/i, { message: 'Código da unidade deve estar no formato FNNN (ex: F301)' })
  codigo_unidade: string;
}