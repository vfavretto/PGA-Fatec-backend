import { Injectable } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { CreateProjectPersonDto } from '../dto/create-project-person.dto';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class CreateProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(data: CreateProjectPersonDto): Promise<ProjectPerson> {
    return this.repository.create(data);
  }
}
