import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { AcaoCPA } from '@prisma/client';
import { CreateCpaActionDto } from './dto/create-cpa-action.dto';
import { UpdateCpaActionDto } from './dto/update-cpa-action.dto';

@Injectable()
export class CpaActionRepository extends BaseRepository<AcaoCPA> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateCpaActionDto) {
    return this.prisma.acaoCPA.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.acaoCPA.findMany({
      where: this.whereActive(),
      include: {
        pga: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.acaoCPA.findFirst({
      where: this.whereActive({ acao_cpa_id: id }),
      include: {
        pga: true,
      },
    });
  }

  async update(id: number, data: UpdateCpaActionDto) {
    return this.prisma.acaoCPA.update({
      where: { acao_cpa_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.acaoCPA.update({
      where: { acao_cpa_id: id },
      data: { ativo: false },
    });
  }

  async findByPgaId(pgaId: number) {
    return this.prisma.acaoCPA.findMany({
      where: this.whereActive({ pga_id: pgaId }),
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.acaoCPA.findMany({
      where: this.whereActive({ unidade_id: unidadeId }),
    });
  }

  async findAllByRegional(regionalId: number) {
    return this.prisma.acaoCPA.findMany({
      where: this.whereActive({ regional_id: regionalId }),
    });
  }

  async findOneWithContext(id: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.acaoCPA.findFirst({
        where: this.whereActive({ acao_cpa_id: id, unidade_id: active_context.id }),
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.prisma.acaoCPA.findFirst({
        where: this.whereActive({ acao_cpa_id: id, regional_id: active_context.id }),
      });
    }

    return this.findOne(id);
  }

  async findByPgaIdWithContext(pgaId: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.acaoCPA.findMany({
        where: this.whereActive({ pga_id: pgaId, unidade_id: active_context.id }),
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.prisma.acaoCPA.findMany({
        where: this.whereActive({ pga_id: pgaId, regional_id: active_context.id }),
      });
    }

    return this.findByPgaId(pgaId);
  }
}
