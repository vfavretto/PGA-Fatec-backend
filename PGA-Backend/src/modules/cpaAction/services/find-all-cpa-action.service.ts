import { Injectable } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';
import { CpaAction } from '../entities/cpa-action.entity';

@Injectable()
export class FindAllCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(): Promise<CpaAction[]> {
    return this.repository.findAll();
  }
}