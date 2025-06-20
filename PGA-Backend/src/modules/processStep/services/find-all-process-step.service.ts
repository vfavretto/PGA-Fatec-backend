import { Injectable } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class FindAllProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(): Promise<ProcessStep[]> {
    return this.repository.findAll();
  }
}
