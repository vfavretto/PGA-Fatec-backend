import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliverableDto {
  @ApiProperty({
    description: 'Número identificador do entregável',
    example: 'ENT-001',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entregavel_numero: string;

  @ApiProperty({
    description: 'Descrição do entregável',
    example: 'Sistema de gestão acadêmica completo',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @ApiPropertyOptional({
    description: 'Detalhes adicionais sobre o entregável',
    example: 'Sistema web responsivo com módulos de gestão de alunos, professores e cursos...',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  detalhes?: string;
}
