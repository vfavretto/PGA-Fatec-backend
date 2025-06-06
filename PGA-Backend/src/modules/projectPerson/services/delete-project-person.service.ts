import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';

@Injectable()
export class DeleteProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(id: number): Promise<void> {
    const projectPerson = await this.repository.findOne(id);
    if (!projectPerson) throw new NotFoundException('ProjectPerson not found');
    await this.repository.remove(id);
  }
}