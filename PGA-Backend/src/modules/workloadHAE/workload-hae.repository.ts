import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { Prisma, TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class WorkloadHaeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TipoVinculoHAECreateInput): Promise<TipoVinculoHAE> {
    return this.prisma.tipoVinculoHAE.create({ data });
  }

  async findAll(): Promise<TipoVinculoHAE[]> {
    return this.prisma.tipoVinculoHAE.findMany();
  }

  async findOne(id: number): Promise<TipoVinculoHAE | null> {
    return this.prisma.tipoVinculoHAE.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.TipoVinculoHAEUpdateInput): Promise<TipoVinculoHAE> {
    return this.prisma.tipoVinculoHAE.update({ where: { id }, data });
  }

  async delete(id: number): Promise<TipoVinculoHAE> {
    return this.prisma.tipoVinculoHAE.delete({ where: { id } });
  }
}