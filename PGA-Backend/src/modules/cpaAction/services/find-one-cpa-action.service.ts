import { Injectable, NotFoundException } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';
import { CpaAction } from '../entities/cpa-action.entity';

@Injectable()
export class FindOneCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(id: string, user?: any): Promise<CpaAction> {
    const action = await this.repository.findOneWithContext(id, user?.active_context);
    if (!action) throw new NotFoundException('AcaoCPA não encontrada');
    return action;
  }
}
