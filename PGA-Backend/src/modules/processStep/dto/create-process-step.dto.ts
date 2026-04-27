import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusVerificacao } from '@prisma/client';

export class CreateProcessStepDto {
  @ApiProperty({
    description: 'ID da ação de projeto relacionada',
    example: 1,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsUUID('4')
  acao_projeto_id: string;

  @ApiProperty({
    description: 'Descrição da etapa do processo',
    example: 'Análise de requisitos do sistema',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiPropertyOptional({
    description: 'ID do entregável relacionado',
    example: 2,
    type: 'integer',
  })
  @IsOptional()
  @IsUUID('4')
  entregavel_id?: string;

  @ApiPropertyOptional({
    description: 'Número de referência da etapa',
    example: 'ET-001',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numero_ref?: string;

  @ApiPropertyOptional({
    description: 'Data prevista para verificação',
    example: '2024-06-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  data_verificacao_prevista?: Date;

  @ApiPropertyOptional({
    description: 'Data em que a verificação foi realizada',
    example: '2024-06-10',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  data_verificacao_realizada?: Date;

  @ApiPropertyOptional({
    description: 'Status da verificação da etapa',
    enum: StatusVerificacao,
    example: 'Pendente',
  })
  @IsOptional()
  @IsEnum(StatusVerificacao)
  status_verificacao?: StatusVerificacao;
}
