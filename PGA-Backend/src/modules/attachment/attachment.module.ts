import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { AttachmentController } from './attachment.controller';
import { CreateAttachmentService } from './services/create-attachment.service';
import { FindAllAttachmentService } from './services/find-all-attachment.service';
import { FindOneAttachmentService } from './services/find-one-attachment.service';
import { UpdateAttachmentService } from './services/update-attachment.service';
import { DeleteAttachmentService } from './services/delete-attachment.service';
import { FindByProcessStepService } from './services/find-by-process-step.service';
import { FindByDeliverableService } from './services/find-by-deliverable.service';
import { AttachmentRepository } from './attachment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AttachmentController],
  providers: [
    AttachmentRepository,
    CreateAttachmentService,
    FindAllAttachmentService,
    FindOneAttachmentService,
    UpdateAttachmentService,
    DeleteAttachmentService,
    FindByProcessStepService,
    FindByDeliverableService,
  ],
  exports: [
    AttachmentRepository,
    CreateAttachmentService,
    FindAllAttachmentService,
    FindOneAttachmentService,
    FindByProcessStepService,
    FindByDeliverableService
  ]
})
export class AttachmentModule {}
