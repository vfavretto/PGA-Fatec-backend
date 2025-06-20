import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCpaActionDto {
  @ApiProperty({
    description: 'ID do PGA ao qual a ação CPA pertence',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  pga_id: number;

  @ApiProperty({
    description: 'Descrição da ação da CPA',
    example: 'Implementar processo de avaliação institucional'
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiPropertyOptional({
    description: 'Justificativa para a ação CPA',
    example: 'Necessário para melhoria da qualidade educacional'
  })
  @IsOptional()
  @IsString()
  justificativa?: string;
}