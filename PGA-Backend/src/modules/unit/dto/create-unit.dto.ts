import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  codigo_fnnn: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nome_completo: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  diretor_nome?: string;
}