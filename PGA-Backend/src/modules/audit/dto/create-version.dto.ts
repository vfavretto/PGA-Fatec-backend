import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateVersionDto {
  @IsString()
  tabela: string;

  @IsInt()
  registro_base_id: number;

  @IsInt()
  ano: number;

  @IsOptional()
  @IsString()
  motivo_alteracao?: string;

  @IsOptional()
  @IsInt()
  criado_por?: number;

  dados: Record<string, any>;
}