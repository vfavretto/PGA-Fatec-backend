import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateAttachmentDto {
  @IsOptional()
  @IsNumber({}, { message: 'O ID da etapa de processo deve ser um número' })
  etapa_processo_id?: number;

  @IsNotEmpty({ message: 'O ID do entregável é obrigatório' })
  @IsNumber({}, { message: 'O ID do entregável deve ser um número' })
  entregavel_id: number;

  @IsNotEmpty({ message: 'O item é obrigatório' })
  @IsString({ message: 'O item deve ser uma string' })
  item: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao: string;

  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  quantidade: number;

  @IsNotEmpty({ message: 'O preço unitário estimado é obrigatório' })
  @IsNumber({}, { message: 'O preço unitário estimado deve ser um número' })
  @Min(0, { message: 'O preço unitário estimado não pode ser negativo' })
  preco_unitario_estimado: number;

  @IsNotEmpty({ message: 'O preço total estimado é obrigatório' })
  @IsNumber({}, { message: 'O preço total estimado deve ser um número' })
  @Min(0, { message: 'O preço total estimado não pode ser negativo' })
  preco_total_estimado: number;
}
