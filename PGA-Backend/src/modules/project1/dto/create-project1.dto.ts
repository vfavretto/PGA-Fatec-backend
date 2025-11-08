import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProject1Dto {
  @ApiProperty({
    description: 'Código único do projeto',
    example: 'PROJ-2024-001',
    type: 'string',
  })
  @IsString()
  codigo_projeto: string;

  @ApiPropertyOptional({
    description: 'Nome do projeto',
    example: 'Implementação de Sistema de Gestão Acadêmica',
  })
  @IsOptional()
  @IsString()
  nome_projeto?: string | null;

  @ApiProperty({
    description: 'ID do PGA ao qual o projeto pertence',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  pga_id: number;

  @ApiProperty({
    description: 'ID do eixo temático',
    example: 2,
    type: 'integer',
  })
  @IsInt()
  eixo_id: number;

  @ApiProperty({
    description: 'ID da prioridade de ação',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  prioridade_id: number;

  @ApiProperty({
    description: 'ID do tema específico',
    example: 3,
    type: 'integer',
  })
  @IsInt()
  tema_id: number;

  @ApiProperty({
    description: 'Descrição do que será feito no projeto',
    example: 'Implementar um sistema completo de gestão acadêmica...',
  })
  @IsString()
  o_que_sera_feito: string;

  @ApiProperty({
    description: 'Justificativa de por que o projeto será feito',
    example:
      'Para modernizar os processos acadêmicos e melhorar a eficiência...',
  })
  @IsString()
  por_que_sera_feito: string;

  @ApiPropertyOptional({
    description: 'Data de início do projeto',
    example: '2024-03-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_inicio?: Date | string | null;

  @ApiPropertyOptional({
    description: 'Data final do projeto',
    example: '2024-12-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_final?: Date | string | null;

  @ApiPropertyOptional({
    description: 'Objetivos institucionais referenciados',
    example: 'Objetivo 1: Modernização tecnológica...',
  })
  @IsOptional()
  @IsString()
  objetivos_institucionais_referenciados?: string | null;

  @ApiPropertyOptional({
    description: 'Indica se é obrigatória a inclusão no projeto',
    example: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio_inclusao?: boolean;

  @ApiPropertyOptional({
    description: 'Indica se é obrigatória a sustentabilidade',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio_sustentabilidade?: boolean;

  @ApiPropertyOptional({
    description: 'Custo total estimado do projeto em reais',
    example: 150000.0,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  custo_total_estimado?: number | null;

  @ApiPropertyOptional({
    description: 'Fonte dos recursos para o projeto',
    example: 'Recursos próprios da instituição',
  })
  @IsOptional()
  @IsString()
  fonte_recursos?: string | null;

  @ApiPropertyOptional({
    description: 'IDs das situações-problema vinculadas ao projeto',
    example: [1, 2, 3],
    type: [Number],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  situacao_problema_ids?: number[];
}
