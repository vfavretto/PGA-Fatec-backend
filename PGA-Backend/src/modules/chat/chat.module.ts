import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
