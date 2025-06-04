import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { Prisma, PrioridadeAcao } from '@prisma/client';

@Injectable()
export class PriorityActionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PrioridadeAcaoCreateInput): Promise<PrioridadeAcao> {
    return this.prisma.prioridadeAcao.create({ data });
  }

  async findAll(): Promise<PrioridadeAcao[]> {
    return this.prisma.prioridadeAcao.findMany();
  }

  async findOne(prioridade_id: number): Promise<PrioridadeAcao | null> {
    return this.prisma.prioridadeAcao.findUnique({ where: { prioridade_id } });
  }

  async update(prioridade_id: number, data: Prisma.PrioridadeAcaoUpdateInput): Promise<PrioridadeAcao> {
    return this.prisma.prioridadeAcao.update({ where: { prioridade_id }, data });
  }

  async delete(prioridade_id: number): Promise<PrioridadeAcao> {
    return this.prisma.prioridadeAcao.delete({ where: { prioridade_id } });
  }
}