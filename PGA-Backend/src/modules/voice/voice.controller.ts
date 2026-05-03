import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VoiceService } from './voice.service';
import { VoiceCommandDto } from './dto/voice-command.dto';

@ApiTags('Voice')
@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('command')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Classifica um comando de voz e retorna a ação a executar' })
  @ApiResponse({
    status: 200,
    description: 'Ação classificada com sucesso',
    schema: {
      example: {
        action: 'dark_mode',
        description: 'Tema escuro ativado',
        recognized: true,
      },
    },
  })
  classify(@Body() dto: VoiceCommandDto) {
    return this.voiceService.classify(dto.transcript);
  }
}
