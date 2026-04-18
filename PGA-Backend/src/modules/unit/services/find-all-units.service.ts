import { Injectable } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class FindAllUnitsService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(user?: any): Promise<Unit[]> {
    const active = user?.active_context;
    if (active && active.tipo === 'unidade') {
      const item = await this.repository.findOne(Number(active.id));
      return item ? [item] : [];
    }

    if (active && active.tipo === 'regional') {
      return this.repository.findAllByRegional(Number(active.id));
    }

    return this.repository.findAll();
  }
}
