import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class ListRegionalUnitsService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: string) {
    return this.repository.findUnitsByRegional(regionalId);
  }
}
