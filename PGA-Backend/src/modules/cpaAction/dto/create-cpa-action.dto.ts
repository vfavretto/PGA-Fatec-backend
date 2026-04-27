import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCpaActionDto {
  @ApiProperty({
    description: 'ID do PGA ao qual a ação CPA pertence',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsUUID('4')
  pga_id: string;

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
