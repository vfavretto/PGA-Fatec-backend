import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusOcorrencia } from '@prisma/client';

export class CreateRoutineOccurrenceDto {
  @ApiProperty({
    description: 'ID da rotina institucional',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  rotina_id: number;

  @ApiProperty({
    description: 'Data de realização da ocorrência',
    example: '2024-06-15',
    type: 'string',
    format: 'date'
  })
  @IsNotEmpty()
  @IsDateString()
  data_realizacao: Date;

  @ApiPropertyOptional({
    description: 'Hora de início da ocorrência',
    example: '2024-06-15T14:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  hora_inicio?: Date;

  @ApiPropertyOptional({
    description: 'Hora de fim da ocorrência',
    example: '2024-06-15T16:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  hora_fim?: Date;

  @ApiPropertyOptional({
    description: 'Local onde a ocorrência foi realizada',
    example: 'Sala de Reuniões A',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  local?: string;

  @ApiPropertyOptional({
    description: 'Pauta da reunião/ocorrência',
    example: 'Discussão sobre melhorias no processo acadêmico...'
  })
  @IsOptional()
  @IsString()
  pauta?: string;

  @ApiPropertyOptional({
    description: 'Resultado ou resumo da ocorrência',
    example: 'Aprovadas as seguintes melhorias...'
  })
  @IsOptional()
  @IsString()
  resultado?: string;

  @ApiPropertyOptional({
    description: 'Link para a ata da reunião',
    example: 'https://docs.google.com/document/d/...',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  link_ata?: string;

  @ApiPropertyOptional({
    description: 'Status da ocorrência',
    enum: StatusOcorrencia,
    example: 'Realizada'
  })
  @IsOptional()
  @IsEnum(StatusOcorrencia)
  status?: StatusOcorrencia;
}