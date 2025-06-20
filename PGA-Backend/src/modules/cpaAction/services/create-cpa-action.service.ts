import { Injectable } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';
import { CreateCpaActionDto } from '../dto/create-cpa-action.dto';
import { CpaAction } from '../entities/cpa-action.entity';

@Injectable()
export class CreateCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(data: CreateCpaActionDto): Promise<CpaAction> {
    return this.repository.create(data);
  }
}
