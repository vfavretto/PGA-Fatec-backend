import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateThemeDto {
  @IsInt()
  tema_num: number;

  @IsInt()
  eixo_id: number;

  @IsString()
  @IsNotEmpty()
  descricao: string;
}
