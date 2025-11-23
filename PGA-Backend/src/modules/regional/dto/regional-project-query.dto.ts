import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusProjetoRegional } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RegionalProjectQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra os projetos pelo status da avaliação regional',
    enum: StatusProjetoRegional,
    example: StatusProjetoRegional.EmAnalise,
  })
  @IsOptional()
  @IsEnum(StatusProjetoRegional)
  status?: StatusProjetoRegional;

  @ApiPropertyOptional({
    description: 'Filtra os projetos de um PGA específico',
    type: Number,
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pgaId?: number;

  @ApiPropertyOptional({
    description: 'Filtra os projetos vinculados a uma unidade específica',
    type: Number,
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  unidadeId?: number;
}

