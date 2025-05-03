import { Module } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
