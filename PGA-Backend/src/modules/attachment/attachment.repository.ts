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

  async findByEtapaProcessoWithContext(etapaProcessoId: number, active_context?: any) {
    if (active_context?.tipo === 'unidade') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          etapa_processo_id: etapaProcessoId,
          etapaProcesso: { unidade_id: active_context.id },
        },
        include: { entregavel: true, etapaProcesso: true },
      });
    }

    if (active_context?.tipo === 'regional') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          etapa_processo_id: etapaProcessoId,
          etapaProcesso: { regional_id: active_context.id },
        },
        include: { entregavel: true, etapaProcesso: true },
      });
    }

    return this.findByEtapaProcesso(etapaProcessoId);
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

  async findByEntregavelWithContext(entregavelId: number, active_context?: any) {
    if (active_context?.tipo === 'unidade') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          entregavel_id: entregavelId,
          entregavel: { unidade_id: active_context.id },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    if (active_context?.tipo === 'regional') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          entregavel_id: entregavelId,
          entregavel: { regional_id: active_context.id },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    return this.findByEntregavel(entregavelId);
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

  async findOneWithContext(id: number, active_context?: any) {
    if (!active_context) return this.findOne(id);

    if (active_context.tipo === 'unidade') {
      return this.prisma.anexo.findFirst({
        where: {
          ...this.whereActive({ attachment_id: id }),
          OR: [
            { etapaProcesso: { unidade_id: active_context.id } },
            { entregavel: { unidade_id: active_context.id } },
          ],
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    if (active_context.tipo === 'regional') {
      return this.prisma.anexo.findFirst({
        where: {
          ...this.whereActive({ attachment_id: id }),
          OR: [
            { etapaProcesso: { regional_id: active_context.id } },
            { entregavel: { regional_id: active_context.id } },
          ],
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    return this.findOne(id);
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        OR: [
          { etapaProcesso: { unidade_id: unidadeId } },
          { entregavel: { unidade_id: unidadeId } },
        ],
      },
      include: { entregavel: true, etapaProcesso: true },
    });
  }

  async findAllByRegional(regionalId: number) {
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        OR: [
          { etapaProcesso: { regional_id: regionalId } },
          { entregavel: { regional_id: regionalId } },
        ],
      },
      include: { entregavel: true, etapaProcesso: true },
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
