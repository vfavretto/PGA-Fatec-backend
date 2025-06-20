import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({
    description: 'Código único da unidade Fatec',
    example: 'F301',
    pattern: '^F\\d{3}$',
  })
  @IsString({ message: 'O código deve ser uma string' })
  @IsNotEmpty({ message: 'O código da unidade é obrigatório' })
  @Matches(/^F\d{3}$/, {
    message: 'Código deve estar no formato FNNN (ex: F301)',
  })
  codigo_fnnn: string;

  @ApiProperty({
    description: 'Nome completo da unidade Fatec',
    example: 'Fatec São Paulo',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da unidade é obrigatório' })
  nome_completo: string;

  @ApiProperty({
    description: 'Endereço completo da unidade',
    example: 'Rua das Flores, 123 - Centro - São Paulo/SP',
    required: false,
  })
  @IsString({ message: 'O endereço deve ser uma string' })
  @IsOptional()
  endereco?: string;

  @ApiProperty({
    description: 'Telefone de contato da unidade',
    example: '(11) 1234-5678',
    required: false,
  })
  @IsString({ message: 'O telefone deve ser uma string' })
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    description: 'Email de contato da unidade',
    example: 'contato@fatecsp.edu.br',
    format: 'email',
    required: false,
  })
  @IsString({ message: 'O email deve ser uma string' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Nome do diretor da unidade',
    example: 'Dr. João Silva Santos',
    required: false,
  })
  @IsString({ message: 'O nome do diretor deve ser uma string' })
  @IsOptional()
  diretor_nome?: string;
}
