import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkloadHaeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  sigla: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @IsOptional()
  @IsString()
  detalhes?: string;
}
