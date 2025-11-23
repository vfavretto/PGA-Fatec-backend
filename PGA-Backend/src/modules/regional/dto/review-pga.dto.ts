import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPGA } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewPgaDto {
  @ApiProperty({
    description: 'Decisão da regional sobre o PGA',
    enum: [StatusPGA.Aprovado, StatusPGA.Reprovado],
    example: StatusPGA.Aprovado,
  })
  @IsNotEmpty()
  @IsIn([StatusPGA.Aprovado, StatusPGA.Reprovado], {
    message: 'Status deve ser "Aprovado" ou "Reprovado".',
  })
  status: StatusPGA;

  @ApiPropertyOptional({
    description: 'Parecer ou justificativa da decisão',
    maxLength: 2000,
    example: 'PGA aprovado após análise da documentação complementar.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  parecer?: string;
}

