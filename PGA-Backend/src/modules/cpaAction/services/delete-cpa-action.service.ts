import { Injectable, NotFoundException } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';

@Injectable()
export class DeleteCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(id: number): Promise<void> {
    const action = await this.repository.findOne(id);
    if (!action) throw new NotFoundException('AcaoCPA não encontrada');
    await this.repository.delete(id);
  }
}