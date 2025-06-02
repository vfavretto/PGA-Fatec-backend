import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { PriorityActionController } from './priority-action.controller';
import { PriorityActionRepository } from './priority-action.repository';
import { CreatePriorityActionService } from './services/create-priority-action.service';
import { FindAllPriorityActionService } from './services/find-all-priority-action.service';
import { FindOnePriorityActionService } from './services/find-one-priority-action.service';
import { UpdatePriorityActionService } from './services/update-priority-action.service';
import { DeletePriorityActionService } from './services/delete-priority-action.service';

@Module({
  imports: [PrismaModule],
  controllers: [PriorityActionController],
  providers: [
    PriorityActionRepository,
    CreatePriorityActionService,
    FindAllPriorityActionService,
    FindOnePriorityActionService,
    UpdatePriorityActionService,
    DeletePriorityActionService,
  ],
  exports: [PriorityActionRepository],
})
export class PriorityActionModule {}