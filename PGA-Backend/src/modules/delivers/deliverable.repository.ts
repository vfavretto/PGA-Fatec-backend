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
}
