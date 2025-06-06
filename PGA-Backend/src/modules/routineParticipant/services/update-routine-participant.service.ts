import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';
import { UpdateRoutineParticipantDto } from '../dto/update-routine-participant.dto';
import { RoutineParticipant } from '../entities/routine-participant.entity';

@Injectable()
export class UpdateRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(id: number, data: UpdateRoutineParticipantDto): Promise<RoutineParticipant> {
    const participante = await this.repository.findOne(id);
    if (!participante) throw new NotFoundException('RotinaParticipante não encontrada');
    return this.repository.update(id, data);
  }
}