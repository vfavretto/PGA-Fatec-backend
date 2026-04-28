import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class FindOnePgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(id: string, user?: any): Promise<PGA> {
    const active = user?.active_context ?? null;
    const pga = await this.repository.findOneWithContext(id, active);
    if (!pga) throw new NotFoundException('PGA não encontrada ou sem acesso');
    return pga;
  }
}
