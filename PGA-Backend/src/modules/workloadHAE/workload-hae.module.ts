import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { WorkloadHaeController } from './workload-hae.controller';
import { WorkloadHaeRepository } from './workload-hae.repository';
import { CreateWorkloadHaeService } from './services/create-workload-hae.service';
import { FindAllWorkloadHaeService } from './services/find-all-workload-hae.service';
import { FindOneWorkloadHaeService } from './services/find-one-workload-hae.service';
import { UpdateWorkloadHaeService } from './services/update-workload-hae.service';
import { DeleteWorkloadHaeService } from './services/delete-workload-hae.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkloadHaeController],
  providers: [
    WorkloadHaeRepository,
    CreateWorkloadHaeService,
    FindAllWorkloadHaeService,
    FindOneWorkloadHaeService,
    UpdateWorkloadHaeService,
    DeleteWorkloadHaeService,
  ],
  exports: [WorkloadHaeRepository],
})
export class WorkloadHaeModule {}
