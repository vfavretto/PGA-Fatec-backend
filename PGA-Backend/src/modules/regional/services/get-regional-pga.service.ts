import { Injectable, NotFoundException } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';

@Injectable()
export class GetRegionalPgaService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, pgaId: number) {
    const pga = await this.repository.findPgaForRegional(regionalId, pgaId);

    if (!pga) {
      throw new NotFoundException(
        'PGA não encontrado ou não pertence às unidades sob sua responsabilidade.',
      );
    }

    return pga;
  }
}

