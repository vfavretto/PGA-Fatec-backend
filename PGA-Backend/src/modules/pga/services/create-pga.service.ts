import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { CreatePgaDto } from '../dto/create-pga.dto';
import { PGA } from '../entities/pga.entity';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class CreatePgaService {
  constructor(
    private readonly repository: PgaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(data: CreatePgaDto): Promise<PGA> {
    const unidade = await this.prisma.unidade.findUnique({
      where: { unidade_id: data.unidade_id },
    });
    if (!unidade) {
      throw new NotFoundException('Unidade informada não encontrada');
    }

    return this.repository.create(data);
  }
}
