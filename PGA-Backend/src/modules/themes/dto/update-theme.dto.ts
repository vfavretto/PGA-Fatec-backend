import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateThemeDto {
  @IsOptional()
  @IsInt()
  tema_num?: number;

  @IsOptional()
  @IsInt()
  eixo_id?: number;

  @IsOptional()
  @IsString()
  descricao?: string;
}
