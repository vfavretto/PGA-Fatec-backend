import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { ProjectPersonController } from './project-person.controller';
import { ProjectPersonRepository } from './project-person.repository';
import { CreateProjectPersonService } from './services/create-project-person.service';
import { FindAllProjectPersonService } from './services/find-all-project-person.service';
import { FindOneProjectPersonService } from './services/find-one-project-person.service';
import { UpdateProjectPersonService } from './services/update-project-person.service';
import { DeleteProjectPersonService } from './services/delete-project-person.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectPersonController],
  providers: [
    ProjectPersonRepository,
    CreateProjectPersonService,
    FindAllProjectPersonService,
    FindOneProjectPersonService,
    UpdateProjectPersonService,
    DeleteProjectPersonService,
  ],
  exports: [
    ProjectPersonRepository,
    CreateProjectPersonService,
    FindAllProjectPersonService,
    FindOneProjectPersonService,
    UpdateProjectPersonService,
    DeleteProjectPersonService,
  ],
})
export class ProjectPersonModule {}
