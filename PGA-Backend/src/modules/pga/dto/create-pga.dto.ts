import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { StatusPGA } from '@prisma/client';

export class CreatePgaDto {
  @IsNotEmpty()
  @IsInt()
  unidade_id: number;

  @IsNotEmpty()
  @IsInt()
  ano: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  versao?: string;

  @IsOptional()
  @IsString()
  analise_cenario?: string;

  @IsOptional()
  @IsDateString()
  data_elaboracao?: Date;

  @IsOptional()
  @IsDateString()
  data_parecer_gpr?: Date;

  @IsOptional()
  @IsEnum(StatusPGA)
  status?: StatusPGA;
}