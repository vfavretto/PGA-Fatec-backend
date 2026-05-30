import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      console.warn('⚠️ Não foi possível conectar ao banco de dados no startup:', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
