import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateThemeDto {
  @IsOptional()
  @IsInt()
  tema_num?: number;

  @IsOptional()
  @IsUUID('4')
  eixo_id?: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
