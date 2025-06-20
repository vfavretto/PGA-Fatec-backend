import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriorityActionDto {
  @ApiProperty({
    description: 'Grau de prioridade (número)',
    example: 1,
    type: 'integer'
  })
  @IsInt()
  @IsNotEmpty()
  grau: number;

  @ApiProperty({
    description: 'Descrição da prioridade de ação',
    example: 'Prioridade Muito Alta',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @ApiProperty({
    description: 'Tipo de gestão relacionado à prioridade',
    example: 'Gestão Acadêmica',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipo_gestao: string;

  @ApiPropertyOptional({
    description: 'Detalhes adicionais sobre a prioridade',
    example: 'Prioridade que deve ser tratada com máxima urgência...'
  })
  @IsOptional()
  @IsString()
  detalhes?: string;
}