import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { PapelProjeto } from '@prisma/client';

export class CreateProjectPersonDto {
  @IsNotEmpty()
  @IsInt()
  acao_projeto_id: number;

  @IsNotEmpty()
  @IsInt()
  pessoa_id: number;

  @IsNotEmpty()
  @IsEnum(PapelProjeto)
  papel: PapelProjeto;

  @IsOptional()
  @IsInt()
  carga_horaria_semanal?: number;

  @IsOptional()
  @IsInt()
  tipo_vinculo_hae_id?: number;
}
