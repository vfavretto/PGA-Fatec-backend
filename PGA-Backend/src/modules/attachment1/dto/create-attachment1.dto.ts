import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateAttachment1Dto {
  @IsNotEmpty({ message: 'O item é obrigatório' })
  @IsString({ message: 'O item deve ser uma string' })
  item: string;

  @IsNotEmpty({ message: 'O projeto é obrigatório' })
  @IsString({ message: 'O projeto deve ser uma string' })
  projeto: string;

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
}
