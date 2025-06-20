import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';

@Injectable()
export class DeleteRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const occurrence = await this.repository.findOne(id);
    if (!occurrence) throw new NotFoundException('Ocorrência de rotina não encontrada');
    
    return this.repository.softDelete(id);
  }
}