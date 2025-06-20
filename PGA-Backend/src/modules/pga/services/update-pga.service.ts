import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { UpdatePgaDto } from '../dto/update-pga.dto';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class UpdatePgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(id: number, data: UpdatePgaDto): Promise<PGA> {
    const pga = await this.repository.findOne(id);
    if (!pga) throw new NotFoundException('PGA não encontrada');
    return this.repository.update(id, data);
  }
}
