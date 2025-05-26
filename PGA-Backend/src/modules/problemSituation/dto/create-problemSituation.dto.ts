import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProblemSituationDto {
  @IsInt()
  @IsNotEmpty()
  pga_id: number;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsOptional()
  fonte?: string;
}

