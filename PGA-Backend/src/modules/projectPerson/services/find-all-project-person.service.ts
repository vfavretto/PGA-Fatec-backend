import { Injectable } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class FindAllProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(user?: any): Promise<ProjectPerson[]> {
    const active = user?.active_context ?? null;
    if (active && active.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id);
    }

    if (active && active.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    return this.repository.findAll();
  }
}
