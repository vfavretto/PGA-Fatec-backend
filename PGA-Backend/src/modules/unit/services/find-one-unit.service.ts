import { Injectable, NotFoundException } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class FindOneUnitService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(id: string, user?: any): Promise<Unit> {
    const unidade = await this.repository.findOneWithContext(id, user?.active_context);
    if (!unidade) throw new NotFoundException('Unidade não encontrada');
    return unidade;
  }
}
