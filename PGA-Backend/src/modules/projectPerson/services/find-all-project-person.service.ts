import { Injectable } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class FindAllProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(): Promise<ProjectPerson[]> {
    return this.repository.findAll();
  }
}