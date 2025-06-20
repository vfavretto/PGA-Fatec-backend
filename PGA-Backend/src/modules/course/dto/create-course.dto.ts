import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { TipoCurso, StatusCurso } from '@prisma/client';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsInt()
  unidade_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nome: string;

  @IsNotEmpty()
  @IsEnum(TipoCurso)
  tipo: TipoCurso;

  @IsNotEmpty()
  @IsEnum(StatusCurso)
  status: StatusCurso;

  @IsOptional()
  @IsInt()
  coordenador_id?: number;
}
