import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/config/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export async function setupTestApp(): Promise<{
  app: INestApplication;
  prismaService: PrismaService;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  const prismaService = app.get<PrismaService>(PrismaService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  return { app, prismaService };
}
