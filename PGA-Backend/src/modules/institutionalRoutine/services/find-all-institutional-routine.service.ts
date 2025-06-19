import { Injectable } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class FindAllInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(): Promise<InstitutionalRoutine[]> {
    return this.repository.findAll();
  }
}