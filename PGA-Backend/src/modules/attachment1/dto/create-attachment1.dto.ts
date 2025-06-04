import { IsNotEmpty, IsNumber, IsString, Min, IsEnum } from 'class-validator';
import { AnexoProjetoUm } from '@prisma/client';

export class CreateAttachment1Dto {
  @IsNotEmpty({ message: 'O item é obrigatório' })
  @IsString({ message: 'O item deve ser uma string' })
  item: string;

  @IsNotEmpty({ message: 'O projeto é obrigatório' })
  @IsString({ message: 'O ID do projeto deve ser uma string' })
  projetoId: string;

  @IsNotEmpty({ message: 'A denominação/especificação é obrigatória' })
  @IsString({ message: 'A denominação/especificação deve ser uma string' })
  denominacaoOuEspecificacao: string;

  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  quantidade: number;

  @IsNotEmpty({ message: 'O preço total estimado é obrigatório' })
  @IsNumber({}, { message: 'O preço total estimado deve ser um número' })
  @Min(0, { message: 'O preço total estimado não pode ser negativo' })
  precoTotalEstimado: number;

  @IsNotEmpty({ message: 'O tipo de anexo é obrigatório' })
  @IsEnum(AnexoProjetoUm, { message: 'Tipo de anexo inválido' })
  flag: AnexoProjetoUm;
}
