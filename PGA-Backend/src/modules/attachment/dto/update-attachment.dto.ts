import { IsNumber, IsOptional, IsString, Min, IsUUID } from 'class-validator';

export class UpdateAttachmentDto {
  @IsOptional()
  @IsUUID('4', { message: 'O campo deve ser um UUID válido' })
  etapa_processo_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O campo deve ser um UUID válido' })
  entregavel_id?: string;

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
