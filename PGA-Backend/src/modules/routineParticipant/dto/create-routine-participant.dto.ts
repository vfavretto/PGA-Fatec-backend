import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoutineParticipantDto {
  @ApiProperty({
    description: 'ID da rotina institucional',
    example: 1,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsUUID('4')
  rotina_id: string;

  @ApiProperty({
    description: 'ID da pessoa participante',
    example: 5,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsUUID('4')
  pessoa_id: string;

  @ApiPropertyOptional({
    description: 'Papel da pessoa na rotina',
    example: 'Coordenador',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  papel?: string;
}
