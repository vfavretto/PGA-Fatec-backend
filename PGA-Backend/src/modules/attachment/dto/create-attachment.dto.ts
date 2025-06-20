import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiPropertyOptional({
    description: 'ID da etapa de processo relacionada',
    example: 1,
    type: 'integer'
  })
  @IsOptional()
  @IsNumber({}, { message: 'O ID da etapa de processo deve ser um número' })
  etapa_processo_id?: number;

  @ApiProperty({
    description: 'ID do entregável relacionado',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty({ message: 'O ID do entregável é obrigatório' })
  @IsNumber({}, { message: 'O ID do entregável deve ser um número' })
  entregavel_id: number;

  @ApiProperty({
    description: 'Nome do item do anexo',
    example: 'Notebook Dell',
    type: 'string'
  })
  @IsNotEmpty({ message: 'O item é obrigatório' })
  @IsString({ message: 'O item deve ser uma string' })
  item: string;

  @ApiProperty({
    description: 'Descrição detalhada do item',
    example: 'Notebook Dell Inspiron 15 3000, Intel Core i5, 8GB RAM, 256GB SSD',
    type: 'string'
  })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao: string;

  @ApiProperty({
    description: 'Quantidade do item',
    example: 10,
    minimum: 1,
    type: 'number'
  })
  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  quantidade: number;

  @ApiProperty({
    description: 'Preço unitário estimado do item em reais',
    example: 2500.00,
    minimum: 0,
    type: 'number'
  })
  @IsNotEmpty({ message: 'O preço unitário estimado é obrigatório' })
  @IsNumber({}, { message: 'O preço unitário estimado deve ser um número' })
  @Min(0, { message: 'O preço unitário estimado não pode ser negativo' })
  preco_unitario_estimado: number;

  @ApiProperty({
    description: 'Preço total estimado (quantidade × preço unitário)',
    example: 25000.00,
    minimum: 0,
    type: 'number'
  })
  @IsNotEmpty({ message: 'O preço total estimado é obrigatório' })
  @IsNumber({}, { message: 'O preço total estimado deve ser um número' })
  @Min(0, { message: 'O preço total estimado não pode ser negativo' })
  preco_total_estimado: number;
}
