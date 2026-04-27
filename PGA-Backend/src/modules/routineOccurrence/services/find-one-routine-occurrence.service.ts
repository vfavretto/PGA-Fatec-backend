import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';
import { RoutineOccurrence } from '../entities/routine-occurrence.entity';

@Injectable()
export class FindOneRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(id: string): Promise<RoutineOccurrence> {
    const ocorrencia = await this.repository.findOne(id);
    if (!ocorrencia)
      throw new NotFoundException('RotinaOcorrencia não encontrada');
    return ocorrencia;
  }
}
