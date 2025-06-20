import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { StatusVerificacao } from '@prisma/client';

export class CreateProcessStepDto {
  @IsNotEmpty()
  @IsInt()
  acao_projeto_id: number;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsInt()
  entregavel_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  numero_ref?: string;

  @IsOptional()
  @IsDateString()
  data_verificacao_prevista?: Date;

  @IsOptional()
  @IsDateString()
  data_verificacao_realizada?: Date;

  @IsOptional()
  @IsEnum(StatusVerificacao)
  status_verificacao?: StatusVerificacao;
}
