import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAttachmentDto {
  @IsOptional()
  @IsNumber({}, { message: 'O ID da etapa de processo deve ser um número' })
  etapa_processo_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O ID do entregável deve ser um número' })
  entregavel_id?: number;

  @IsOptional()
  @IsString({ message: 'O item deve ser uma string' })
  item?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao?: string;

  @IsOptional()
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  quantidade?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O preço unitário estimado deve ser um número' })
  @Min(0, { message: 'O preço unitário estimado não pode ser negativo' })
  preco_unitario_estimado?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O preço total estimado deve ser um número' })
  @Min(0, { message: 'O preço total estimado não pode ser negativo' })
  preco_total_estimado?: number;
}
