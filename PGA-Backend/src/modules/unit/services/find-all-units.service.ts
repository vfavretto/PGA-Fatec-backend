import { Injectable } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class FindAllUnitsService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(): Promise<Unit[]> {
    return this.repository.findAll();
  }
}