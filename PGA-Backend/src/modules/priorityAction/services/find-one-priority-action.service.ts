import { Injectable, NotFoundException } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';
import { PrioridadeAcao } from '@prisma/client';

@Injectable()
export class FindOnePriorityActionService {
  constructor(private readonly repository: PriorityActionRepository) {}

  async execute(prioridade_id: number): Promise<PrioridadeAcao> {
    const result = await this.repository.findOne(prioridade_id);
    if (!result) throw new NotFoundException('Prioridade não encontrada');
    return result;
  }
}