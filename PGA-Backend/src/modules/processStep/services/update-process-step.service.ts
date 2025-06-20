import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessStepRepository } from '../process-step.repository';
import { UpdateProcessStepDto } from '../dto/update-process-step.dto';
import { ProcessStep } from '../entities/process-step.entity';

@Injectable()
export class UpdateProcessStepService {
  constructor(private readonly repository: ProcessStepRepository) {}

  async execute(id: number, data: UpdateProcessStepDto): Promise<ProcessStep> {
    const step = await this.repository.findOne(id);
    if (!step) throw new NotFoundException('EtapaProcesso não encontrada');
    return this.repository.update(id, data);
  }
}
