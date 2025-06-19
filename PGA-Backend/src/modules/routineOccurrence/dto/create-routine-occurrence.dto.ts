import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString, IsEnum, MaxLength } from 'class-validator';
import { StatusOcorrencia } from '@prisma/client';

export class CreateRoutineOccurrenceDto {
  @IsNotEmpty()
  @IsInt()
  rotina_id: number;

  @IsNotEmpty()
  @IsDateString()
  data_realizacao: Date;

  @IsOptional()
  @IsDateString()
  hora_inicio?: Date;

  @IsOptional()
  @IsDateString()
  hora_fim?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  local?: string;

  @IsOptional()
  @IsString()
  pauta?: string;

  @IsOptional()
  @IsString()
  resultado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  link_ata?: string;

  @IsOptional()
  @IsEnum(StatusOcorrencia)
  status?: StatusOcorrencia;
}