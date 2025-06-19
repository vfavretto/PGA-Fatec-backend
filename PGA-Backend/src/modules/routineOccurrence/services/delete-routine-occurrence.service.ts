import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';

@Injectable()
export class DeleteRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(id: number): Promise<void> {
    const ocorrencia = await this.repository.findOne(id);
    if (!ocorrencia) throw new NotFoundException('RotinaOcorrencia não encontrada');
    await this.repository.delete(id);
  }
}