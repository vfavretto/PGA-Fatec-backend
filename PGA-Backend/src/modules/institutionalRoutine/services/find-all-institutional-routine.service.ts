import { Injectable } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class FindAllInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(user?: any): Promise<InstitutionalRoutine[]> {
    const active = user?.active_context;
    if (active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id);
    }

    if (active?.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    return this.repository.findAll();
  }
}
