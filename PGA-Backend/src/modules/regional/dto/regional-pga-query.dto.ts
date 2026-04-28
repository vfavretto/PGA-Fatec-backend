import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPGA } from '@prisma/client';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';

export class RegionalPgaQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra os PGAs pelo status atual',
    enum: StatusPGA,
    example: StatusPGA.Submetido,
  })
  @IsOptional()
  @IsEnum(StatusPGA)
  status?: StatusPGA;

  @ApiPropertyOptional({
    description: 'UUID da unidade para filtrar os PGAs sob sua jurisdição',
    type: String,
    example: 'bb000000-0000-4000-a000-000000000001',
  })
  @IsOptional()
  @IsUUID('4')
  unidadeId?: string;
}
