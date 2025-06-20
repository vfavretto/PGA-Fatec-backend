import { Injectable } from '@nestjs/common';
import { RoutineOccurrenceRepository } from '../routine-occurrence.repository';
import { CreateRoutineOccurrenceDto } from '../dto/create-routine-occurrence.dto';
import { RoutineOccurrence } from '../entities/routine-occurrence.entity';

@Injectable()
export class CreateRoutineOccurrenceService {
  constructor(private readonly repository: RoutineOccurrenceRepository) {}

  async execute(data: CreateRoutineOccurrenceDto): Promise<RoutineOccurrence> {
    return this.repository.create(data);
  }
}
