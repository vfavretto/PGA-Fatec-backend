import { Injectable, NotFoundException } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class GetRegionalService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: string) {
    const regional = await this.repository.findById(regionalId);
    if (!regional) {
      throw new NotFoundException('Regional não encontrada');
    }
    return regional;
  }
}
