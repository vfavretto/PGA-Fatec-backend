import { Injectable } from '@nestjs/common';
import { RoutineParticipantRepository } from '../routine-participant.repository';
import { CreateRoutineParticipantDto } from '../dto/create-routine-participant.dto';
import { RoutineParticipant } from '../entities/routine-participant.entity';

@Injectable()
export class CreateRoutineParticipantService {
  constructor(private readonly repository: RoutineParticipantRepository) {}

  async execute(data: CreateRoutineParticipantDto): Promise<RoutineParticipant> {
    return this.repository.create(data);
  }
}