import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Anexo } from '@prisma/client';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class AttachmentRepository extends BaseRepository<Anexo> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateAttachmentDto) {
    return this.prisma.anexo.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.anexo.findMany({
      where: this.whereActive(),
      include: {
        etapaProcesso: true,
        entregavel: true,
      },
    });
  }

  async findByEtapaProcesso(etapaProcessoId: number) {
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        etapa_processo_id: etapaProcessoId,
      },
      include: {
        entregavel: true,
      },
    });
  }

  async findByEntregavel(entregavelId: number) {
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        entregavel_id: entregavelId,
      },
      include: {
        etapaProcesso: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.anexo.findFirst({
      where: this.whereActive({ attachment_id: id }),
      include: {
        etapaProcesso: true,
        entregavel: true,
      },
    });
  }

  async update(id: number, data: UpdateAttachmentDto) {
    return this.prisma.anexo.update({
      where: { anexo_id: id },
      data: data,
    });
  }

  async delete(id: number) {
    return this.prisma.anexo.update({
      where: { anexo_id: id },
      data: { ativo: false },
    });
  }
}
