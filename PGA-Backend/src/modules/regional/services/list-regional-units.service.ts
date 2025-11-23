import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class ListRegionalUnitsService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number) {
    return this.repository.findUnitsByRegional(regionalId);
  }
}

