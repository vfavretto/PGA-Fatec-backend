import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class ListRegionaisService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
