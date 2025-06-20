import { Injectable, NotFoundException } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';
import { UpdatePriorityActionDto } from '../dto/update-priority-action.dto';
import { PrioridadeAcao } from '@prisma/client';

@Injectable()
export class UpdatePriorityActionService {
  constructor(private readonly repository: PriorityActionRepository) {}

  async execute(
    prioridade_id: number,
    dto: UpdatePriorityActionDto,
  ): Promise<PrioridadeAcao> {
    const exists = await this.repository.findOne(prioridade_id);
    if (!exists) throw new NotFoundException('Prioridade não encontrada');
    return this.repository.update(prioridade_id, dto);
  }
}
