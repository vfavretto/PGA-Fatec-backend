import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCpaActionDto {
  @IsNotEmpty()
  @IsInt()
  pga_id: number;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  justificativa?: string;
}
