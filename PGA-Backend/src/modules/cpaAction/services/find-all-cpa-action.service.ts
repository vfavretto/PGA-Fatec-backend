import { Injectable } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';
import { CpaAction } from '../entities/cpa-action.entity';

@Injectable()
export class FindAllCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(user?: any): Promise<CpaAction[]> {
    const active = user?.active_context;
    if (active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id);
    }

    if (active?.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    return this.repository.findAll();
  }
}
