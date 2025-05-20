import { Module } from '@nestjs/common';
import { PrismaModule } from '@/config/prisma.module';
import { Attachment1Controller } from '../attachment1/attachment1.controller';
import { CreateAttachment1Service } from './services/create-attachment1.service';
import { FindAllAttachment1Service } from './services/find-all-attachment1.service';
import { FindOneAttachment1Service } from './services/find-one-attachment1.service';
import { UpdateAttachment1Service } from './services/update-attachment1.service';
import { DeleteAttachment1Service } from './services/delete-attachment1.service';

@Module({
  imports: [PrismaModule],
  controllers: [Attachment1Controller],
  providers: [
    CreateAttachment1Service,
    FindAllAttachment1Service,
    FindOneAttachment1Service,
    UpdateAttachment1Service,
    DeleteAttachment1Service,
  ],
})
export class Attachment1Module {}
