import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { Attachment1Module } from './modules/attachment1/attachment1.module';
import { ThematicAxisModule } from './modules/thematicAxis/thematicAxis.module';
import { ThemesModule } from './modules/themes/themes.module';
import { ProblemSituationModule } from './modules/problemSituation/problemSituation.module';
import { Project1Module } from './modules/project1/project1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    Attachment1Module,
    ThematicAxisModule,
    ThemesModule,
    ProblemSituationModule,
    Project1Module,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [],
  exports: [PrismaService],
})
export class AppModule {}
