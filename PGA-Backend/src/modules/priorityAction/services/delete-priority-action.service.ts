import { Injectable, NotFoundException } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';

@Injectable()
export class DeletePriorityActionService {
  constructor(private readonly repo: PriorityActionRepository) {}

  async execute(id: number, usuario_id?: number) {
    const priority = await this.repo.findOne(id);
    if (!priority) throw new NotFoundException('Prioridade de ação não encontrada');
    
    return this.repo.delete(id);
  }
}