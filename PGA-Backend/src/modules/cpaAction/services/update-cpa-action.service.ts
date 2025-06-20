import { Injectable, NotFoundException } from '@nestjs/common';
import { CpaActionRepository } from '../cpa-action.repository';
import { UpdateCpaActionDto } from '../dto/update-cpa-action.dto';
import { CpaAction } from '../entities/cpa-action.entity';

@Injectable()
export class UpdateCpaActionService {
  constructor(private readonly repository: CpaActionRepository) {}

  async execute(id: number, data: UpdateCpaActionDto): Promise<CpaAction> {
    const action = await this.repository.findOne(id);
    if (!action) throw new NotFoundException('AcaoCPA não encontrada');
    return this.repository.update(id, data);
  }
}
