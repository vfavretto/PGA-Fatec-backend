import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegionalDto {
  @ApiProperty({
    description: 'Nome da regional (campo no banco: nome_regional)',
  })
  @IsString()
  @IsNotEmpty()
  nome_regional: string;

  @ApiProperty({
    description: 'Código da regional (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigo_regional?: string;

  @ApiProperty({
    description: 'Pessoa responsável pela regional (id)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  responsavel_id?: number;

  @ApiProperty({ description: 'Se a regional está ativa', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'IDs de pessoas vinculadas à regional',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  pessoas_ids?: number[];
}
