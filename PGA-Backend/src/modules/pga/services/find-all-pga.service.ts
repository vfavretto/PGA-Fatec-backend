import { Injectable } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class FindAllPgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(user?: any): Promise<PGA[]> {
    const active = user?.active_context ?? null;

    if (active && active.tipo === 'unidade') {
      return this.repository.findAllByUnit(Number(active.id));
    }

    if (active && active.tipo === 'regional') {
      return this.repository.findAllByRegional(Number(active.id));
    }

    return this.repository.findAll();
  }
}
