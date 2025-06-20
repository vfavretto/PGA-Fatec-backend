import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { ThematicAxisRepository } from './thematicAxis.repository';
import { CreateThematicAxisService } from './services/create-thematicAxis.service';
import { FindAllThematicAxisService } from './services/find-all-thematicAxis.service';
import { FindOneThematicAxisService } from './services/find-one-thematicAxis.service';
import { UpdateThematicAxisService } from './services/update-thematicAxis.service';
import { DeleteThematicAxisService } from './services/delete-thematicAxis.service';
import { ThematicAxisController } from './thematicAxis.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    ThematicAxisRepository,
    CreateThematicAxisService,
    FindAllThematicAxisService,
    FindOneThematicAxisService,
    UpdateThematicAxisService,
    DeleteThematicAxisService,
  ],
  controllers: [ThematicAxisController],
})
export class ThematicAxisModule {}
