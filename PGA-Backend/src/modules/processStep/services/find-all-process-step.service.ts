import { Injectable } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class FindAllProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(user?: any): Promise<ProcessStep[]> {
    const active = user?.active_context;
    if (active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id);
    }

    if (active?.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    return this.repository.findAll();
  }
}
