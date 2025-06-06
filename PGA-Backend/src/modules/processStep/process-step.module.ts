import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { ProcessStepController } from './process-step.controller';
import { ProcessStepRepository } from './process-step.repository';
import { CreateProcessStepService } from './services/create-process-step.service';
import { FindAllProcessStepService } from './services/find-all-process-step.service';
import { FindOneProcessStepService } from './services/find-one-process-step.service';
import { UpdateProcessStepService } from './services/update-process-step.service';
import { DeleteProcessStepService } from './services/delete-process-step.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProcessStepController],
  providers: [
    ProcessStepRepository,
    CreateProcessStepService,
    FindAllProcessStepService,
    FindOneProcessStepService,
    UpdateProcessStepService,
    DeleteProcessStepService,
  ],
  exports: [
    ProcessStepRepository,
    CreateProcessStepService,
    FindAllProcessStepService,
    FindOneProcessStepService,
    UpdateProcessStepService,
    DeleteProcessStepService,
  ],
})
export class ProcessStepModule {}