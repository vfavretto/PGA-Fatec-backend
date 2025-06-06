import { Injectable } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class FindAllPgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(): Promise<PGA[]> {
    return this.repository.findAll();
  }
}