import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class FindOneProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(id: number): Promise<ProcessStep> {
    const step = await this.repository.findOne(id);
    if (!step) throw new NotFoundException('EtapaProcesso não encontrada');
    return step;
  }
}