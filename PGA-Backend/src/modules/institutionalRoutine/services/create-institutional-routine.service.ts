import { Injectable } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { CreateInstitutionalRoutineDto } from '../dto/create-institutional-routine.dto';
import { InstitutionalRoutine } from '../entities/institutional-routine.entity';

@Injectable()
export class CreateInstitutionalRoutineService {
  constructor(private readonly repository: InstitutionalRoutineRepository) {}

  async execute(data: CreateInstitutionalRoutineDto): Promise<InstitutionalRoutine> {
    return this.repository.create(data);
  }
}