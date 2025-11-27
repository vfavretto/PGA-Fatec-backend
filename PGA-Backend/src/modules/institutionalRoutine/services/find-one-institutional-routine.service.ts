import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class FindOneInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(id: number, user?: any): Promise<InstitutionalRoutine> {
    const rotina = await this.repository.findOneWithContext(id, user?.active_context);
    if (!rotina) throw new NotFoundException('RotinaInstitucional não encontrada');
    return rotina;
  }
}
