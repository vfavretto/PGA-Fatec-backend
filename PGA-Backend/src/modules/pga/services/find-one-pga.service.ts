import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class FindOnePgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(id: number): Promise<PGA> {
    const pga = await this.repository.findOne(id);
    if (!pga) throw new NotFoundException('PGA não encontrada');
    return pga;
  }
}