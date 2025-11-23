import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusProjetoRegional } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewProjectDto {
  @ApiProperty({
    description: 'Decisão da regional sobre o projeto',
    enum: [StatusProjetoRegional.Aprovado, StatusProjetoRegional.Reprovado],
    example: StatusProjetoRegional.Aprovado,
  })
  @IsNotEmpty()
  @IsIn([StatusProjetoRegional.Aprovado, StatusProjetoRegional.Reprovado], {
    message: 'Status deve ser "Aprovado" ou "Reprovado".',
  })
  status: StatusProjetoRegional;

  @ApiPropertyOptional({
    description: 'Parecer ou justificativa da decisão regional',
    maxLength: 2000,
    example: 'Projeto aprovado mediante adequação de orçamento.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  parecer?: string;
}

