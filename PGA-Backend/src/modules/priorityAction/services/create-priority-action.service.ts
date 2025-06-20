import { Injectable } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';
import { CreatePriorityActionDto } from '../dto/create-priority-action.dto';
import { PrioridadeAcao } from '@prisma/client';

@Injectable()
export class CreatePriorityActionService {
  constructor(private readonly repository: PriorityActionRepository) {}

  async execute(dto: CreatePriorityActionDto): Promise<PrioridadeAcao> {
    return this.repository.create(dto);
  }
}
