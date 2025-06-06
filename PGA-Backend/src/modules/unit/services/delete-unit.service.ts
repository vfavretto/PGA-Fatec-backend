import { Injectable, NotFoundException } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';

@Injectable()
export class DeleteUnitService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(id: number): Promise<void> {
    const unidade = await this.repository.findOne(id);
    if (!unidade) throw new NotFoundException('Unidade não encontrada');
    await this.repository.remove(id);
  }
}