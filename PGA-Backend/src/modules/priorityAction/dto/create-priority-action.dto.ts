import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePriorityActionDto {
  @IsInt()
  @IsNotEmpty()
  grau: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipo_gestao: string;

  @IsOptional()
  @IsString()
  detalhes?: string;
}
