import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { Prisma, EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class DeliverableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EntregavelLinkSeiCreateInput): Promise<EntregavelLinkSei> {
    return this.prisma.entregavelLinkSei.create({ data });
  }

  async findAll(): Promise<EntregavelLinkSei[]> {
    return this.prisma.entregavelLinkSei.findMany();
  }

  async findOne(entregavel_id: number): Promise<EntregavelLinkSei | null> {
    return this.prisma.entregavelLinkSei.findUnique({ where: { entregavel_id } });
  }

  async update(entregavel_id: number, data: Prisma.EntregavelLinkSeiUpdateInput): Promise<EntregavelLinkSei> {
    return this.prisma.entregavelLinkSei.update({ where: { entregavel_id }, data });
  }

  async delete(entregavel_id: number): Promise<EntregavelLinkSei> {
    return this.prisma.entregavelLinkSei.delete({ where: { entregavel_id } });
  }
}