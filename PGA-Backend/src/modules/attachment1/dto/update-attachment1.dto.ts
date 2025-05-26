import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AnexoProjetoUm } from '@prisma/client';

export class UpdateAttachment1Dto {
  @IsOptional()
  @IsString({ message: 'O item deve ser uma string' })
  item?: string;

  @IsOptional()
  @IsString({ message: 'O ID do projeto deve ser uma string' })
  projetoId?: string; // ID do projeto relacionado

  @IsOptional()
  @IsString({ message: 'A denominação/especificação deve ser uma string' })
  denominacaoOuEspecificacao?: string;

  @IsOptional()
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  quantidade?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O preço total estimado deve ser um número' })
  @Min(0, { message: 'O preço total estimado não pode ser negativo' })
  precoTotalEstimado?: number;

  @IsOptional()
  @IsEnum(AnexoProjetoUm, { message: 'Tipo de anexo inválido' })
  flag?: AnexoProjetoUm;
}
