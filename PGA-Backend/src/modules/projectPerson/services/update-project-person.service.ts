import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';
import { UpdateProjectPersonDto } from '../dto/update-project-person.dto';
import { ProjectPerson } from '../entities/project-person.entity';

@Injectable()
export class UpdateProjectPersonService {
  constructor(private readonly repository: ProjectPersonRepository) {}

  async execute(
    id: number,
    data: UpdateProjectPersonDto,
  ): Promise<ProjectPerson> {
    const projectPerson = await this.repository.findOne(id);
    if (!projectPerson) throw new NotFoundException('ProjectPerson not found');
    return this.repository.update(id, data);
  }
}
