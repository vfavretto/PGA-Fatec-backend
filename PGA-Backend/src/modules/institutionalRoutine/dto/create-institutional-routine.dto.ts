import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { TipoRotina, PeriodicidadeRotina, StatusRotina } from '@prisma/client';

export class CreateInstitutionalRoutineDto {
  @IsNotEmpty()
  @IsInt()
  pga_id: number;

  @IsOptional()
  @IsInt()
  curso_id?: number;

  @IsNotEmpty()
  @IsEnum(TipoRotina)
  tipo_rotina: TipoRotina;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsEnum(PeriodicidadeRotina)
  periodicidade: PeriodicidadeRotina;

  @IsOptional()
  @IsDateString()
  data_inicio?: Date;

  @IsOptional()
  @IsDateString()
  data_fim?: Date;

  @IsNotEmpty()
  @IsInt()
  responsavel_id: number;

  @IsOptional()
  @IsString()
  entregavel_esperado?: string;

  @IsOptional()
  @IsEnum(StatusRotina)
  status?: StatusRotina;
}