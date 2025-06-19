import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';
import { UpdateRoutineOccurrenceDto } from '../dto/update-routine-occurrence.dto';
import { RoutineOccurrence } from '../entities/routine-occurrence.entity';

@Injectable()
export class UpdateRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(id: number, data: UpdateRoutineOccurrenceDto): Promise<RoutineOccurrence> {
    const ocorrencia = await this.repository.findOne(id);
    if (!ocorrencia) throw new NotFoundException('RotinaOcorrencia não encontrada');
    return this.repository.update(id, data);
  }
}