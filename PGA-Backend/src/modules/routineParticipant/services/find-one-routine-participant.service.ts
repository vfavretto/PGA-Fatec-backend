import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';
import { RoutineParticipant } from '../entities/routine-participant.entity';

@Injectable()
export class FindOneRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(id: string): Promise<RoutineParticipant> {
    const participante = await this.repository.findOne(id);
    if (!participante)
      throw new NotFoundException('RotinaParticipante não encontrada');
    return participante;
  }
}
