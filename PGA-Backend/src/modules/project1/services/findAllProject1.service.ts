import { Injectable } from '@nestjs/common';
import { Project1Repository } from '../project1.repository';

@Injectable()
export class FindAllProject1Service {
  constructor(private readonly project1Repository: Project1Repository) {}

  async execute(user?: any) {
    const active = user?.active_context ?? null;
    if (active && active.tipo === 'unidade') {
      return this.project1Repository.findAllByUnit(Number(active.id));
    }

    if (active && active.tipo === 'regional') {
      return this.project1Repository.findAllByRegional(Number(active.id));
    }

    return this.project1Repository.findAll();
  }
}
