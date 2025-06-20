import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';

@Injectable()
export class DeleteProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const step = await this.repository.findOne(id);
    if (!step) throw new NotFoundException('Etapa do processo não encontrada');
    
    return this.repository.softDelete(id);
  }
}