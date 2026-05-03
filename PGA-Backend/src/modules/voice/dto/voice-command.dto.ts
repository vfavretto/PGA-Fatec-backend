import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VoiceCommandDto {
  @ApiProperty({ example: 'ativar tema escuro', description: 'Texto transcrito do comando de voz' })
  @IsString()
  @MinLength(1)
  transcript: string;
}
