import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProject1Dto {
  @IsString()
  codigo_projeto: string;

  @IsInt()
  pga_id: number;

  @IsInt()
  eixo_id: number;

  @IsInt()
  prioridade_id: number;

  @IsInt()
  tema_id: number;

  @IsString()
  o_que_sera_feito: string;

  @IsString()
  por_que_sera_feito: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_inicio?: Date | string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_final?: Date | string | null;

  @IsOptional()
  @IsString()
  objetivos_institucionais_referenciados?: string | null;

  @IsOptional()
  @IsBoolean()
  obrigatorio_inclusao?: boolean;

  @IsOptional()
  @IsBoolean()
  obrigatorio_sustentabilidade?: boolean;
}
