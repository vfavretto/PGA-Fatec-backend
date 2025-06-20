import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class FindOneInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(id: number): Promise<InstitutionalRoutine> {
    const rotina = await this.repository.findOne(id);
    if (!rotina)
      throw new NotFoundException('RotinaInstitucional não encontrada');
    return rotina;
  }
}
