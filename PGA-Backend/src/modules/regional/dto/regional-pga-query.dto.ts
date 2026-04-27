import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPGA } from '@prisma/client';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'ID da unidade para filtrar os PGAs sob sua jurisdição',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsUUID('4')
  unidadeId?: string;
}
