import { Injectable } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { CreatePgaDto } from '../dto/create-pga.dto';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class CreatePgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(data: CreatePgaDto): Promise<PGA> {
    return this.repository.create(data);
  }
}
