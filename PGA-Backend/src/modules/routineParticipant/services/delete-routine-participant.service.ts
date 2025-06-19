import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';

@Injectable()
export class DeleteRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(id: number): Promise<void> {
    const participante = await this.repository.findOne(id);
    if (!participante) throw new NotFoundException('RotinaParticipante não encontrada');
    await this.repository.delete(id);
  }
}