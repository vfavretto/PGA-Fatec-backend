import { IsUUID, IsNotEmpty, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoCurso, StatusCurso } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({
    description: 'ID da unidade à qual o curso pertence',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsUUID('4')
  unidade_id: string;

  @ApiProperty({
    description: 'Nome do curso',
    example: 'Tecnologia em Sistemas para Internet',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Tipo do curso',
    enum: TipoCurso,
    example: 'Superior'
  })
  @IsNotEmpty()
  @IsEnum(TipoCurso)
  tipo: TipoCurso;

  @ApiProperty({
    description: 'Status atual do curso',
    enum: StatusCurso,
    example: 'Ativo'
  })
  @IsNotEmpty()
  @IsEnum(StatusCurso)
  status: StatusCurso;

  @ApiPropertyOptional({
    description: 'ID do coordenador do curso',
    example: 5,
    type: 'integer'
  })
  @IsOptional()
  @IsUUID('4')
  coordenador_id?: string;
}
