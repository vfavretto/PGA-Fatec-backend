import { Injectable, NotFoundException } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class UpdateUnitService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(id: number, data: UpdateUnitDto): Promise<Unit> {
    const unidade = await this.repository.findOne(id);
    if (!unidade) throw new NotFoundException('Unidade não encontrada');
    return this.repository.update(id, data);
  }
}