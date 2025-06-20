import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { UnitController } from './unit.controller';
import { UnitRepository } from './unit.repository';
import { CreateUnitService } from './services/create-unit.service';
import { FindAllUnitsService } from './services/find-all-units.service';
import { FindOneUnitService } from './services/find-one-unit.service';
import { UpdateUnitService } from './services/update-unit.service';
import { DeleteUnitService } from './services/delete-unit.service';

@Module({
  imports: [PrismaModule],
  controllers: [UnitController],
  providers: [
    UnitRepository,
    CreateUnitService,
    FindAllUnitsService,
    FindOneUnitService,
    UpdateUnitService,
    DeleteUnitService,
  ],
  exports: [
    UnitRepository,
    CreateUnitService,
    FindAllUnitsService,
    FindOneUnitService,
    UpdateUnitService,
    DeleteUnitService,
  ],
})
export class UnitModule {}
