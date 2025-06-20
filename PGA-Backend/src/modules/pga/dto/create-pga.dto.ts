import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPGA } from '@prisma/client';

export class CreatePgaDto {
  @ApiProperty({
    description: 'ID da unidade responsável pelo PGA',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  unidade_id: number;

  @ApiProperty({
    description: 'Ano de referência do PGA',
    example: 2024,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  ano: number;

  @ApiPropertyOptional({
    description: 'Versão do PGA',
    example: '1.0',
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  versao?: string;

  @ApiPropertyOptional({
    description: 'Análise do cenário atual',
    example: 'Análise detalhada do cenário institucional...'
  })
  @IsOptional()
  @IsString()
  analise_cenario?: string;

  @ApiPropertyOptional({
    description: 'Data de elaboração do PGA',
    example: '2024-01-15',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  data_elaboracao?: Date;

  @ApiPropertyOptional({
    description: 'Data do parecer GPR',
    example: '2024-02-15',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  data_parecer_gpr?: Date;

  @ApiPropertyOptional({
    description: 'Status atual do PGA',
    enum: StatusPGA,
    example: 'EmElaboracao'
  })
  @IsOptional()
  @IsEnum(StatusPGA)
  status?: StatusPGA;
}
