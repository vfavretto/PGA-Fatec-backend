import { IsString, IsOptional, IsInt, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProblemSituationDto {
  @ApiProperty({
    description: 'Código da categoria no formato hierárquico',
    example: '1.2.01',
    pattern: '^\\d+\\.\\d+\\.\\d+$'
  })
  @IsString()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'Código deve seguir o formato: 0.1.01',
  })
  codigo_categoria: string;

  @ApiProperty({
    description: 'Descrição da situação problema',
    example: 'Inadequação da infraestrutura tecnológica'
  })
  @IsString()
  descricao: string;

  @ApiPropertyOptional({
    description: 'Fonte da situação problema',
    example: 'Relatório de avaliação institucional 2023'
  })
  @IsOptional()
  @IsString()
  fonte?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
    type: 'integer'
  })
  @IsOptional()
  @IsInt()
  ordem?: number;
}
