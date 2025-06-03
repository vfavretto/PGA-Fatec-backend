import { Injectable, NotFoundException } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';
import { PrioridadeAcao } from '@prisma/client';

@Injectable()
export class DeletePriorityActionService {
  constructor(private readonly repository: PriorityActionRepository) {}

  async execute(prioridade_id: number): Promise<PrioridadeAcao> {
    const exists = await this.repository.findOne(prioridade_id);
    if (!exists) throw new NotFoundException('Prioridade não encontrada');
    return this.repository.delete(prioridade_id);
  }
}