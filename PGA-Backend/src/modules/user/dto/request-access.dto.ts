import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestAccessDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'Email institucional do usuário',
    example: 'joao.silva@fatec.sp.gov.br',
    format: 'email',
  })
  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Código da unidade Fatec (formato FNNN)',
    example: 'F301',
  })
  @IsNotEmpty({ message: 'O código da unidade é obrigatório' })
  @Matches(/^F\d{3}$/i, {
    message: 'Código da unidade deve estar no formato FNNN (ex: F301)',
  })
  codigo_unidade: string;
}
