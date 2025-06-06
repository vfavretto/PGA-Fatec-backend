import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';

@Injectable()
export class DeleteProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(id: number): Promise<void> {
    const step = await this.repository.findOne(id);
    if (!step) throw new NotFoundException('EtapaProcesso não encontrada');
    await this.repository.delete(id);
  }
}