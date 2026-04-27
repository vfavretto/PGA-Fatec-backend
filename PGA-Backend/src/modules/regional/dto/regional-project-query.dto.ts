import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusProjetoRegional } from '@prisma/client';
import { IsEnum, IsString, IsOptional } from 'class-validator';

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
    type: String,
    example: '00000000-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @IsString()
  pgaId?: string;

  @ApiPropertyOptional({
    description: 'Filtra os projetos vinculados a uma unidade específica',
    type: String,
    example: '00000000-0000-0000-0000-000000000003',
  })
  @IsOptional()
  @IsString()
  unidadeId?: string;
}
