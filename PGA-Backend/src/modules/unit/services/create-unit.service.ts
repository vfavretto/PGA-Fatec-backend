import { Injectable } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class CreateUnitService {
  constructor(private readonly repository: UnitRepository) {}

  async execute(data: CreateUnitDto): Promise<Unit> {
    return this.repository.create(data);
  }
}
