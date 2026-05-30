import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatService } from './services/chat.service';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Papel do autor da mensagem',
    enum: ['user', 'assistant'],
    example: 'user',
  })
  @IsString()
  @IsNotEmpty({ message: 'O papel (role) não pode ser vazio' })
  @IsIn(['user', 'assistant'], {
    message: 'O papel (role) deve ser "user" ou "assistant"',
  })
  role: 'user' | 'assistant';

  @ApiProperty({
    description: 'Conteúdo de texto da mensagem',
    example: 'O que é o PGA?',
  })
  @IsString()
  @IsNotEmpty({
    message: 'O conteúdo (content) da mensagem não pode ser vazio',
  })
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'Histórico de mensagens da conversa',
    type: [ChatMessageDto],
  })
  @IsArray({ message: 'A propriedade "messages" deve ser um array' })
  @ArrayNotEmpty({ message: 'A lista de mensagens não pode estar vazia' })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Resposta gerada pelo assistente baseado na documentação',
    example: 'O PGA (Plano de Gestão Anual) é...',
  })
  reply: string;
}

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar mensagem ao assistente inteligente',
    description:
      'Tira dúvidas sobre as diretrizes, preenchimento de campos e troubleshooting do PGA FATEC com base na documentação local.',
  })
  @ApiBody({ type: ChatRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Resposta gerada com sucesso pelo chatbot',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Payload inválido ou erro de processamento',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado — token JWT ausente ou inválido',
  })
  async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      const reply = await this.chatService.sendMessage(body.messages as any);
      return { reply };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro inesperado ao processar mensagem no chatbot',
      );
    }
  }
}
