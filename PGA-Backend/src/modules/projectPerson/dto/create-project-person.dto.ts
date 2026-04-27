import { IsInt, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PapelProjeto } from '@prisma/client';

export class CreateProjectPersonDto {
  @ApiProperty({
    description: 'ID da ação de projeto',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsUUID('4')
  acao_projeto_id: string;

  @ApiProperty({
    description: 'ID da pessoa vinculada ao projeto',
    example: 5,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsUUID('4')
  pessoa_id: string;

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
  @IsUUID('4')
  tipo_vinculo_hae_id?: string;
}
