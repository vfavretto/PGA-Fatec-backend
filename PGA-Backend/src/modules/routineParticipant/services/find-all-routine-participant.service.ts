import { Injectable } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';
import { RoutineParticipant } from '../entities/routine-participant.entity';

@Injectable()
export class FindAllRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(): Promise<RoutineParticipant[]> {
    return this.repository.findAll();
  }
}