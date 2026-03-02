import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class FindOneProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(id: number, user?: any): Promise<ProjectPerson> {
    const active = user?.active_context ?? null;
    const projectPerson = await this.repository.findOneWithContext(id, active);
    if (!projectPerson) throw new NotFoundException('Vínculo não encontrado ou sem acesso');
    return projectPerson;
  }
}
