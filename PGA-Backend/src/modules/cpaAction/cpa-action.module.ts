import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { CpaActionController } from './cpa-action.controller';
import { CpaActionRepository } from './cpa-action.repository';
import { CreateCpaActionService } from './services/create-cpa-action.service';
import { FindAllCpaActionService } from './services/find-all-cpa-action.service';
import { FindOneCpaActionService } from './services/find-one-cpa-action.service';
import { UpdateCpaActionService } from './services/update-cpa-action.service';
import { DeleteCpaActionService } from './services/delete-cpa-action.service';

@Module({
  imports: [PrismaModule],
  controllers: [CpaActionController],
  providers: [
    CpaActionRepository,
    CreateCpaActionService,
    FindAllCpaActionService,
    FindOneCpaActionService,
    UpdateCpaActionService,
    DeleteCpaActionService,
  ],
  exports: [
    CpaActionRepository,
    CreateCpaActionService,
    FindAllCpaActionService,
    FindOneCpaActionService,
    UpdateCpaActionService,
    DeleteCpaActionService,
  ],
})
export class CpaActionModule {}