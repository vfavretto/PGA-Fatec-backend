import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkloadHaeDto {
  @ApiProperty({
    description: 'Sigla do tipo de carga horária HAE',
    example: 'HAE01',
    maxLength: 10
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  sigla: string;

  @ApiProperty({
    description: 'Descrição da carga horária HAE',
    example: 'Hora Atividade Específica - Coordenação de Curso',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @ApiPropertyOptional({
    description: 'Detalhes adicionais sobre a carga horária HAE',
    example: 'Atividades relacionadas à coordenação pedagógica do curso...'
  })
  @IsOptional()
  @IsString()
  detalhes?: string;
}
