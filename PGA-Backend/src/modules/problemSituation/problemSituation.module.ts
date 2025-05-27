import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { ProblemSituationRepository } from './problemSituation.repository';
import { CreateProblemSituationService } from './services/create-problemSituation.service';
import { FindAllProblemSituationService } from './services/find-all-problemSituation.service';
import { FindOneProblemSituationService } from './services/find-one-problemSituation.service';
import { UpdateProblemSituationService } from './services/update-problemSituation.service';
import { DeleteProblemSituationService } from './services/delete-problemSituation.service';
import { ProblemSituationController } from './problemSituation.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    ProblemSituationRepository,
    CreateProblemSituationService,
    FindAllProblemSituationService,
    FindOneProblemSituationService,
    UpdateProblemSituationService,
    DeleteProblemSituationService,
  ],
  controllers: [ProblemSituationController],
})
export class ProblemSituationModule {}