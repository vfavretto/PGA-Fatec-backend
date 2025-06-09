import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdateProblemSituationDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d+\.\d+\.\d+$/, { message: 'Código deve seguir o formato: 0.1.01' })
  codigo_categoria?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  fonte?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}