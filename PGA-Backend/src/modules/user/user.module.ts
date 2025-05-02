import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/create-user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from '@/config/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
})
export class UserModule {}
