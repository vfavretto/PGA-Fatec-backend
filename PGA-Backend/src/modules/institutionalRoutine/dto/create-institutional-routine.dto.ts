import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoRotina, PeriodicidadeRotina, StatusRotina } from '@prisma/client';

export class CreateInstitutionalRoutineDto {
  @ApiProperty({
    description: 'ID do PGA ao qual a rotina pertence',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  pga_id: number;

  @ApiPropertyOptional({
    description: 'ID do curso relacionado (opcional)',
    example: 2,
    type: 'integer'
  })
  @IsOptional()
  @IsInt()
  curso_id?: number;

  @ApiProperty({
    description: 'Tipo da rotina institucional',
    enum: TipoRotina,
    example: 'Academica'
  })
  @IsNotEmpty()
  @IsEnum(TipoRotina)
  tipo_rotina: TipoRotina;

  @ApiProperty({
    description: 'Título da rotina institucional',
    example: 'Conselho de Classe',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da rotina',
    example: 'Reunião periódica para avaliação do desempenho acadêmico dos estudantes'
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Periodicidade da rotina',
    enum: PeriodicidadeRotina,
    example: 'Semestral'
  })
  @IsNotEmpty()
  @IsEnum(PeriodicidadeRotina)
  periodicidade: PeriodicidadeRotina;

  @ApiPropertyOptional({
    description: 'Data de início da rotina',
    example: '2024-03-01',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  data_inicio?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim da rotina',
    example: '2024-12-31',
    type: 'string',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  data_fim?: Date;

  @ApiProperty({
    description: 'ID da pessoa responsável pela rotina',
    example: 5,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  responsavel_id: number;

  @ApiPropertyOptional({
    description: 'Entregável esperado da rotina',
    example: 'Relatório de desempenho acadêmico'
  })
  @IsOptional()
  @IsString()
  entregavel_esperado?: string;

  @ApiPropertyOptional({
    description: 'Status atual da rotina',
    enum: StatusRotina,
    example: 'Ativa'
  })
  @IsOptional()
  @IsEnum(StatusRotina)
  status?: StatusRotina;
}