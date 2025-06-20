import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoutineParticipantDto {
  @IsNotEmpty()
  @IsInt()
  rotina_id: number;

  @IsNotEmpty()
  @IsInt()
  pessoa_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  papel?: string;
}
