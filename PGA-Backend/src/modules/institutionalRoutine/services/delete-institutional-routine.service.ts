import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';

@Injectable()
export class DeleteInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(id: number): Promise<void> {
    const rotina = await this.repository.findOne(id);
    if (!rotina) throw new NotFoundException('RotinaInstitucional não encontrada');
    await this.repository.delete(id);
  }
}