import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThematicAxisDto {
  @ApiProperty({
    description: 'Número do eixo temático',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  numero: number;

  @ApiProperty({
    description: 'Nome do eixo temático',
    example: 'Gestão e Planejamento Institucional',
  })
  @IsString()
  @IsNotEmpty()
  nome_eixo: string;

  @ApiProperty({
    description: 'Descrição detalhada do eixo temático',
    example: 'Eixo focado no planejamento estratégico e gestão institucional',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;
}
