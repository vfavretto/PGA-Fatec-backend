import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeliverableDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entregavel_numero: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  detalhes?: string;
}