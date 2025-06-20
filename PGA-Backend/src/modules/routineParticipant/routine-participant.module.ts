import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { RoutineParticipantController } from './routine-participant.controller';
import { RoutineParticipantRepository } from './routine-participant.repository';
import { CreateRoutineParticipantService } from './services/create-routine-participant.service';
import { FindAllRoutineParticipantService } from './services/find-all-routine-participant.service';
import { FindOneRoutineParticipantService } from './services/find-one-routine-participant.service';
import { UpdateRoutineParticipantService } from './services/update-routine-participant.service';
import { DeleteRoutineParticipantService } from './services/delete-routine-participant.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoutineParticipantController],
  providers: [
    RoutineParticipantRepository,
    CreateRoutineParticipantService,
    FindAllRoutineParticipantService,
    FindOneRoutineParticipantService,
    UpdateRoutineParticipantService,
    DeleteRoutineParticipantService,
  ],
  exports: [
    RoutineParticipantRepository,
    CreateRoutineParticipantService,
    FindAllRoutineParticipantService,
    FindOneRoutineParticipantService,
    UpdateRoutineParticipantService,
    DeleteRoutineParticipantService,
  ],
})
export class RoutineParticipantModule {}
