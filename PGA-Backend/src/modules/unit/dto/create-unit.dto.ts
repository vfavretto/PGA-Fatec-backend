import { IsString, IsNotEmpty, IsOptional, Matches, IsInt } from 'class-validator';
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
    description: 'Nome da unidade Fatec (campo no banco: nome_unidade)',
    example: 'Fatec São Paulo',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da unidade é obrigatório' })
  nome_unidade: string;

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
    description: 'ID da regional à qual a unidade pertence',
    example: 1,
  })
  @IsInt({ message: 'O id da regional deve ser um inteiro' })
  regional_id: number;

  @ApiProperty({
    description: 'ID da pessoa que é diretor da unidade (opcional)',
    example: 123,
    required: false,
  })
  @IsInt({ message: 'O id do diretor deve ser um inteiro' })
  @IsOptional()
  diretor_id?: number;
}
