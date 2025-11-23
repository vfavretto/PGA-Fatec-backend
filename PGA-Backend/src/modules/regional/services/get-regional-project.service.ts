import { Injectable, NotFoundException } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class GetRegionalProjectService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, projectId: number) {
    const projeto = await this.repository.findProjectForRegional(
      regionalId,
      projectId,
    );

    if (!projeto) {
      throw new NotFoundException(
        'Projeto não encontrado ou não pertence às unidades sob sua responsabilidade.',
      );
    }

    return projeto;
  }
}

