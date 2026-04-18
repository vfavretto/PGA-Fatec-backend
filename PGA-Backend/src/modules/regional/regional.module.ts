import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { RegionalController } from './regional.controller';
import { RegionalRepository } from './regional.repository';
import { ListRegionalUnitsService } from './services/list-regional-units.service';
import { ListRegionaisService } from './services/list-regionais.service';
import { ListRegionalPgasService } from './services/list-regional-pgas.service';
import { GetRegionalPgaService } from './services/get-regional-pga.service';
import { ReviewRegionalPgaService } from './services/review-regional-pga.service';
import { ListRegionalProjectsService } from './services/list-regional-projects.service';
import { GetRegionalProjectService } from './services/get-regional-project.service';
import { ReviewRegionalProjectService } from './services/review-regional-project.service';
import { CreateRegionalService } from './services/create-regional.service';
import { FindRegionalByResponsavelService } from './services/find-regional-by-responsavel.service';
import { GetRegionalService } from './services/get-regional.service';

@Module({
  imports: [PrismaModule],
  controllers: [RegionalController],
  providers: [
    RegionalRepository,
    CreateRegionalService,
    ListRegionaisService,
    ListRegionalUnitsService,
    ListRegionalPgasService,
    GetRegionalPgaService,
    GetRegionalService,
    ReviewRegionalPgaService,
    FindRegionalByResponsavelService,
    ListRegionalProjectsService,
    GetRegionalProjectService,
    ReviewRegionalProjectService,
  ],
})
export class RegionalModule {}
