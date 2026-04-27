import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class FindOneProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(id: string, user?: any): Promise<ProcessStep> {
    const step = await this.repository.findOneWithContext(id, user?.active_context);
    if (!step) throw new NotFoundException('EtapaProcesso não encontrada');
    return step;
  }
}
