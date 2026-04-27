import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';

@Injectable()
export class DeleteRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(id: string, usuarioLogadoId?: string, motivo?: string) {
    const participante = await this.repository.findOne(id);
    if (!participante)
      throw new NotFoundException('RotinaParticipante não encontrada');

    return this.repository.softDelete(id);
  }
}
