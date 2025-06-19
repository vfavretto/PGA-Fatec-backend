import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class FindOneProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(id: number): Promise<ProjectPerson> {
    const projectPerson = await this.repository.findOne(id);
    if (!projectPerson) throw new NotFoundException('ProjectPerson not found');
    return projectPerson;
  }
}