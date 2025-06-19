import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { RoutineOccurrenceController } from './routine-occurrence.controller';
import { RoutineOccurrenceRepository } from './routine-occurrence.repository';
import { CreateRoutineOccurrenceService } from './services/create-routine-occurrence.service';
import { FindAllRoutineOccurrenceService } from './services/find-all-routine-occurrence.service';
import { FindOneRoutineOccurrenceService } from './services/find-one-routine-occurrence.service';
import { UpdateRoutineOccurrenceService } from './services/update-routine-occurrence.service';
import { DeleteRoutineOccurrenceService } from './services/delete-routine-occurrence.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoutineOccurrenceController],
  providers: [
    RoutineOccurrenceRepository,
    CreateRoutineOccurrenceService,
    FindAllRoutineOccurrenceService,
    FindOneRoutineOccurrenceService,
    UpdateRoutineOccurrenceService,
    DeleteRoutineOccurrenceService,
  ],
  exports: [
    RoutineOccurrenceRepository,
    CreateRoutineOccurrenceService,
    FindAllRoutineOccurrenceService,
    FindOneRoutineOccurrenceService,
    UpdateRoutineOccurrenceService,
    DeleteRoutineOccurrenceService,
  ],
})
export class RoutineOccurrenceModule {}