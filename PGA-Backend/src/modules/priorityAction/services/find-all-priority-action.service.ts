import { Injectable } from '@nestjs/common';
import { PriorityActionRepository } from '../priority-action.repository';
import { PrioridadeAcao } from '@prisma/client';

@Injectable()
export class FindAllPriorityActionService {
  constructor(private readonly repository: PriorityActionRepository) {}

  async execute(): Promise<PrioridadeAcao[]> {
    return this.repository.findAll();
  }
}
