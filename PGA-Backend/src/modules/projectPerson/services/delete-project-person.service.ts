import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectPersonRepository } from '../project-person.repository';

@Injectable()
export class DeleteProjectPersonService {
  constructor(
    private readonly projectPersonRepository: ProjectPersonRepository,
  ) {}

  async execute(id: string, usuarioLogadoId?: string, motivo?: string) {
    const projetoPessoa = await this.projectPersonRepository.findOne(id);
    if (!projetoPessoa)
      throw new NotFoundException('Pessoa no projeto não encontrada');

    return this.projectPersonRepository.delete(id);
  }
}
