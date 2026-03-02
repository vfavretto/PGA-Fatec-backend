import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { DeliverableModule } from './modules/delivers/deliverable.module';
import { MailModule } from './modules/mail/mail.module';
import { PriorityActionModule } from './modules/priorityAction/priority-action.module';
import { Project1Module } from './modules/project1/project1.module';
import { ThematicAxisModule } from './modules/thematicAxis/thematicAxis.module';
import { WorkloadHaeModule } from './modules/workloadHAE/workload-hae.module';
import { ThemesModule } from './modules/themes/themes.module';
import { ProblemSituationModule } from './modules/problemSituation/problemSituation.module';
import { CourseModule } from './modules/course/course.module';
import { CpaActionModule } from './modules/cpaAction/cpa-action.module';
import { InstitutionalRoutineModule } from './modules/institutionalRoutine/institutional-routine.module';
import { PgaModule } from './modules/pga/pga.module';
import { ProcessStepModule } from './modules/processStep/process-step.module';
import { ProjectPersonModule } from './modules/projectPerson/project-person.module';
import { RoutineOccurrenceModule } from './modules/routineOccurrence/routine-occurrence.module';
import { RoutineParticipantModule } from './modules/routineParticipant/routine-participant.module';
import { UnitModule } from './modules/unit/unit.module';
import { AuditModule } from './modules/audit/audit.module';
import { RegionalModule } from './modules/regional/regional.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    AttachmentModule,
    MailModule,
    DeliverableModule,
    PriorityActionModule,
    Project1Module,
    ThematicAxisModule,
    ThemesModule,
    WorkloadHaeModule,
    ProblemSituationModule,
    CourseModule,
    CpaActionModule,
    InstitutionalRoutineModule,
    PgaModule,
    ProcessStepModule,
    ProjectPersonModule,
    RoutineOccurrenceModule,
    RoutineParticipantModule,
    UnitModule,
    AuditModule,
    RegionalModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
