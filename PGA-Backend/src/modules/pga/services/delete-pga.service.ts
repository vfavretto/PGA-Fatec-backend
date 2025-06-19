import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';

@Injectable()
export class DeletePgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(id: number): Promise<void> {
    const pga = await this.repository.findOne(id);
    if (!pga) throw new NotFoundException('PGA não encontrada');
    await this.repository.remove(id);
  }
}