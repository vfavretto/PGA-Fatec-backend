import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { InstitutionalRoutineController } from './institutional-routine.controller';
import { InstitutionalRoutineRepository } from './institutional-routine.repository';
import { CreateInstitutionalRoutineService } from './services/create-institutional-routine.service';
import { FindAllInstitutionalRoutineService } from './services/find-all-institutional-routine.service';
import { FindOneInstitutionalRoutineService } from './services/find-one-institutional-routine.service';
import { UpdateInstitutionalRoutineService } from './services/update-institutional-routine.service';
import { DeleteInstitutionalRoutineService } from './services/delete-institutional-routine.service';

@Module({
  imports: [PrismaModule],
  controllers: [InstitutionalRoutineController],
  providers: [
    InstitutionalRoutineRepository,
    CreateInstitutionalRoutineService,
    FindAllInstitutionalRoutineService,
    FindOneInstitutionalRoutineService,
    UpdateInstitutionalRoutineService,
    DeleteInstitutionalRoutineService,
  ],
  exports: [
    InstitutionalRoutineRepository,
    CreateInstitutionalRoutineService,
    FindAllInstitutionalRoutineService,
    FindOneInstitutionalRoutineService,
    UpdateInstitutionalRoutineService,
    DeleteInstitutionalRoutineService,
  ],
})
export class InstitutionalRoutineModule {}