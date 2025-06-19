import { Injectable } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { CreateProcessStepDto } from '../dto/create-process-step.dto';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class CreateProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(data: CreateProcessStepDto): Promise<ProcessStep> {
    return this.repository.create(data);
  }
}