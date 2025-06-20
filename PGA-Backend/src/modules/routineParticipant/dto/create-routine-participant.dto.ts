import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoutineParticipantDto {
  @ApiProperty({
    description: 'ID da rotina institucional',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  rotina_id: number;

  @ApiProperty({
    description: 'ID da pessoa participante',
    example: 5,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  pessoa_id: number;

  @ApiPropertyOptional({
    description: 'Papel da pessoa na rotina',
    example: 'Coordenador',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  papel?: string;
}