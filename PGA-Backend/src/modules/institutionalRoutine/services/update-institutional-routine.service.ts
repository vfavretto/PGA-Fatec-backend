import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { UpdateInstitutionalRoutineDto } from '../dto/update-institutional-routine.dto';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class UpdateInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(
    id: number,
    data: UpdateInstitutionalRoutineDto,
  ): Promise<InstitutionalRoutine> {
    const rotina = await this.repository.findOne(id);
    if (!rotina)
      throw new NotFoundException('RotinaInstitucional não encontrada');
    return this.repository.update(id, data);
  }
}
