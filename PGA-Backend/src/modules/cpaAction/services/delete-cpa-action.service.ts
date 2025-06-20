import { Injectable, NotFoundException } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';

@Injectable()
export class DeleteCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const action = await this.repository.findOne(id);
    if (!action) throw new NotFoundException('Ação CPA não encontrada');
    
    return this.repository.softDelete(id);
  }
}