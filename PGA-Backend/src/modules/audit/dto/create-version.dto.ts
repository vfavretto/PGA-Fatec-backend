import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateVersionDto {
  @IsString()
  tabela: string;

  @IsUUID('4')
  registro_base_id: string;

  @IsInt()
  ano: number;

  @IsOptional()
  @IsString()
  motivo_alteracao?: string;

  @IsOptional()
  @IsUUID('4')
  criado_por?: string;

  dados: Record<string, any>;
}
