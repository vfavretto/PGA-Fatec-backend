import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { EntregavelLinkSei } from '@prisma/client';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Injectable()
export class DeliverableRepository extends BaseRepository<EntregavelLinkSei> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateDeliverableDto) {
    return this.prisma.entregavelLinkSei.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.entregavelLinkSei.findMany({
      where: this.whereActive(),
      orderBy: { entregavel_numero: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.entregavelLinkSei.findFirst({
      where: this.whereActive({ entregavel_id: id }),
    });
  }

  async update(id: number, data: UpdateDeliverableDto) {
    return this.prisma.entregavelLinkSei.update({
      where: { entregavel_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.entregavelLinkSei.update({
      where: { entregavel_id: id },
      data: { ativo: false },
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.entregavelLinkSei.findMany({
      where: this.whereActive({ unidade_id: unidadeId }),
      orderBy: { entregavel_numero: 'asc' },
    });
  }

  async findAllByRegional(regionalId: number) {
    return this.prisma.entregavelLinkSei.findMany({
      where: this.whereActive({ regional_id: regionalId }),
      orderBy: { entregavel_numero: 'asc' },
    });
  }

  async findOneWithContext(id: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.entregavelLinkSei.findFirst({
        where: this.whereActive({ entregavel_id: id, unidade_id: active_context.id }),
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.prisma.entregavelLinkSei.findFirst({
        where: this.whereActive({ entregavel_id: id, regional_id: active_context.id }),
      });
    }

    return this.findOne(id);
  }
}
