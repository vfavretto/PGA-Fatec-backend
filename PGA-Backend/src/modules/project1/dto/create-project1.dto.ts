import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProject1Dto {
  @IsInt()
  pga_id: number;

  @IsInt()
  eixo_id: number;

  @IsInt()
  prioridade_id: number;

  @IsString()
  @MaxLength(255)
  tema: string;

  @IsString()
  o_que_sera_feito: string;

  @IsString()
  por_que_sera_feito: string;

  @IsOptional()
  @IsDateString()
  data_inicio?: string;

  @IsOptional()
  @IsDateString()
  data_final?: string;

  @IsOptional()
  @IsString()
  objetivos_institucionais_referenciados?: string;

  @IsBoolean()
  obrigatorio_inclusao: boolean;

  @IsBoolean()
  obrigatorio_sustentabilidade: boolean;
}
