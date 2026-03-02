import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';
import { RegionalPgaQueryDto } from '../dto/regional-pga-query.dto';

@Injectable()
export class ListRegionalPgasService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, filters: RegionalPgaQueryDto) {
    return this.repository.findPgasByRegional(regionalId, filters);
  }
}

