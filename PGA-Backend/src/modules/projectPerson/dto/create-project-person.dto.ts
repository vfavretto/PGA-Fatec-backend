import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PapelProjeto } from '@prisma/client';

export class CreateProjectPersonDto {
  @ApiProperty({
    description: 'ID da ação de projeto',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  acao_projeto_id: number;

  @ApiProperty({
    description: 'ID da pessoa vinculada ao projeto',
    example: 5,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  pessoa_id: number;

  @ApiProperty({
    description: 'Papel da pessoa no projeto',
    enum: PapelProjeto,
    example: 'Coordenador'
  })
  @IsNotEmpty()
  @IsEnum(PapelProjeto)
  papel: PapelProjeto;

  @ApiPropertyOptional({
    description: 'Carga horária semanal dedicada ao projeto',
    example: 10,
    type: 'integer'
  })
  @IsOptional()
  @IsInt()
  carga_horaria_semanal?: number;

  @ApiPropertyOptional({
    description: 'ID do tipo de vínculo HAE',
    example: 2,
    type: 'integer'
  })
  @IsOptional()
  @IsInt()
  tipo_vinculo_hae_id?: number;
}
