import { IsString, IsOptional, IsInt, Matches } from 'class-validator';

export class CreateProblemSituationDto {
  @IsString()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'Código deve seguir o formato: 0.1.01',
  })
  codigo_categoria: string;

  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  fonte?: string;

  @IsOptional()
  @IsInt()
  ordem?: number;
}
