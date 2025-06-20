import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { DeliverableController } from './deliverable.controller';
import { DeliverableRepository } from './deliverable.repository';
import { CreateDeliverableService } from './services/create-deliverable.service';
import { FindAllDeliverableService } from './services/find-all-deliverable.service';
import { FindOneDeliverableService } from './services/find-one-deliverable.service';
import { UpdateDeliverableService } from './services/update-deliverable.service';
import { DeleteDeliverableService } from './services/delete-deliverable.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeliverableController],
  providers: [
    DeliverableRepository,
    CreateDeliverableService,
    FindAllDeliverableService,
    FindOneDeliverableService,
    UpdateDeliverableService,
    DeleteDeliverableService,
  ],
  exports: [DeliverableRepository],
})
export class DeliverableModule {}
