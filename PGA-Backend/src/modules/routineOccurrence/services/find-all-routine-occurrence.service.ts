import { Injectable } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';
import { RoutineOccurrence } from '../entities/routine-occurrence.entity';

@Injectable()
export class FindAllRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(): Promise<RoutineOccurrence[]> {
    return this.repository.findAll();
  }
}
