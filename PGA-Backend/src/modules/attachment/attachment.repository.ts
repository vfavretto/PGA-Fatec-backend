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

  async findByEtapaProcesso(etapaProcessoId: string) {
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

  async findByEtapaProcessoWithContext(etapaProcessoId: string, active_context?: any) {
    if (active_context?.tipo === 'unidade') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          etapa_processo_id: etapaProcessoId,
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: active_context.id } } },
        },
        include: { entregavel: true, etapaProcesso: true },
      });
    }

    if (active_context?.tipo === 'regional') {
      const unidadeIds = await this.getUnidadeIdsByPessoaRegional(active_context.id);
      if (!unidadeIds.length) return [];
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          etapa_processo_id: etapaProcessoId,
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: { in: unidadeIds } } } },
        },
        include: { entregavel: true, etapaProcesso: true },
      });
    }

    return this.findByEtapaProcesso(etapaProcessoId);
  }

  async findByEntregavel(entregavelId: string) {
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

  async findByEntregavelWithContext(entregavelId: string, active_context?: any) {
    if (active_context?.tipo === 'unidade') {
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          entregavel_id: entregavelId,
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: active_context.id } } },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    if (active_context?.tipo === 'regional') {
      const unidadeIds = await this.getUnidadeIdsByPessoaRegional(active_context.id);
      if (!unidadeIds.length) return [];
      return this.prisma.anexo.findMany({
        where: {
          ...this.whereActive(),
          entregavel_id: entregavelId,
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: { in: unidadeIds } } } },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    return this.findByEntregavel(entregavelId);
  }

  async findOne(id: string) {
    return this.prisma.anexo.findFirst({
      where: this.whereActive({ attachment_id: id }),
      include: {
        etapaProcesso: true,
        entregavel: true,
      },
    });
  }

  async findOneWithContext(id: string, active_context?: any) {
    if (!active_context) return this.findOne(id);

    if (active_context.tipo === 'unidade') {
      return this.prisma.anexo.findFirst({
        where: {
          ...this.whereActive({ attachment_id: id }),
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: active_context.id } } },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    if (active_context.tipo === 'regional') {
      const ids = await this.getUnidadeIdsByPessoaRegional(active_context.id);
      if (!ids.length) return null;
      return this.prisma.anexo.findFirst({
        where: {
          ...this.whereActive({ attachment_id: id }),
          etapaProcesso: { acaoProjeto: { pga: { unidade_id: { in: ids } } } },
        },
        include: { etapaProcesso: true, entregavel: true },
      });
    }

    return this.findOne(id);
  }

  async findAllByUnit(unidadeId: string) {
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        etapaProcesso: { acaoProjeto: { pga: { unidade_id: unidadeId } } },
      },
      include: { entregavel: true, etapaProcesso: true },
    });
  }

  async findAllByRegional(regionalId: string) {
    const unidadeIds = await this.getUnidadeIdsByPessoaRegional(regionalId);
    if (!unidadeIds.length) return [];
    return this.prisma.anexo.findMany({
      where: {
        ...this.whereActive(),
        etapaProcesso: { acaoProjeto: { pga: { unidade_id: { in: unidadeIds } } } },
      },
      include: { entregavel: true, etapaProcesso: true },
    });
  }

  /** Resolves the unit IDs accessible to a regional user via PessoaRegional → Regional → Unidade */
  private async getUnidadeIdsByPessoaRegional(pessoaId: string): Promise<string[]> {
    const vinculos = await this.prisma.pessoaRegional.findMany({
      where: { pessoa_id: pessoaId, ativo: true },
      include: {
        regional: {
          select: {
            unidades: { where: { ativo: true }, select: { unidade_id: true } },
          },
        },
      },
    });
    return vinculos.flatMap((v) => v.regional.unidades.map((u) => u.unidade_id));
  }

  async update(id: string, data: UpdateAttachmentDto) {
    return this.prisma.anexo.update({
      where: { anexo_id: id },
      data: data,
    });
  }

  async delete(id: string) {
    return this.prisma.anexo.update({
      where: { anexo_id: id },
      data: { ativo: false },
    });
  }
}
