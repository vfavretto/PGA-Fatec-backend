import { Injectable, NotFoundException } from '@nestjs/common';
import { Project1Repository } from '../project1.repository';

@Injectable()
export class FindOneProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(id: string, user?: any) {
    const active = user?.active_context ?? null;
    const projeto = await this.project1Repository.findOneWithContext(id, active);
    if (!projeto) throw new NotFoundException('Projeto não encontrado ou sem acesso');
    return projeto;
  }
}
