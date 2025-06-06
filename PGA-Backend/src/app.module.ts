import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { Attachment1Module } from './modules/attachment1/attachment1.module';
import { DeliverableModule } from './modules/delivers/deliverable.module';
import { MailModule } from './modules/mail/mail.module';
import { PriorityActionModule } from './modules/priorityAction/priority-action.module';
import { Project1Module } from './modules/project1/project1.module';
import { ThematicAxisModule } from './modules/thematicAxis/thematicAxis.module';
import { WorkloadHaeModule } from './modules/workloadHAE/workload-hae.module';
import { ThemesModule } from './modules/themes/themes.module';
import { ProblemSituationModule } from './modules/problemSituation/problemSituation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    Attachment1Module,
    MailModule,
    DeliverableModule,
    PriorityActionModule,
    Project1Module,
    ThematicAxisModule,
    ThemesModule,
    WorkloadHaeModule,
    ProblemSituationModule,
    //TODO: Add other modules here
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
