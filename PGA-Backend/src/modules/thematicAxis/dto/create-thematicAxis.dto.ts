import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThematicAxisDto {
  @IsInt()
  numero: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}