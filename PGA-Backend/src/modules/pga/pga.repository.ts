import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PGA } from '@prisma/client';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';

@Injectable()
export class PgaRepository extends BaseRepository<PGA> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreatePgaDto) {
    return this.prisma.pGA.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.pGA.findMany({
      where: this.whereActive(),
      include: {
        unidade: true,
        regionalResponsavel: true,
      },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.pGA.findMany({
      where: this.whereActive({ unidade_id: unidadeId }),
      include: { unidade: true, regionalResponsavel: true },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findAllByRegional(regionalId: number) {
    const vinculos = await this.prisma.pessoaUnidade.findMany({
      where: { pessoa_id: regionalId, ativo: true },
      select: { unidade_id: true },
    });

    const unidadeIds = vinculos.map((v) => v.unidade_id);
    if (!unidadeIds.length) return [];

    return this.prisma.pGA.findMany({
      where: this.whereActive({ unidade_id: { in: unidadeIds } }),
      include: { unidade: true, regionalResponsavel: true },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findOne(id: number) {
    return this.prisma.pGA.findFirst({
      where: this.whereActive({ pga_id: id }),
      include: {
        unidade: true,
        regionalResponsavel: true,
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePgaDto) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data: { ativo: false } as any,
    });
  }

  async findByAnoAndUnidade(ano: number, unidadeId: number) {
    return this.prisma.pGA.findFirst({
      where: this.whereActive({
        ano,
        unidade_id: unidadeId,
      }),
      include: {
        unidade: true,
      },
    });
  }

  async findOneWithContext(id: number, active_context?: { tipo: string; id?: number } | null) {
    const pga = await this.findOne(id);
    if (!pga) return null;

    if (active_context) {
      if (active_context.tipo === 'unidade') {
        if (pga.unidade_id !== Number(active_context.id)) return null;
      }

      if (active_context.tipo === 'regional') {
        const vinculos = await this.prisma.pessoaUnidade.findMany({
          where: { pessoa_id: Number(active_context.id), ativo: true },
          select: { unidade_id: true },
        });
        const unidadeIds = vinculos.map((v) => v.unidade_id);
        if (!unidadeIds.includes(pga.unidade_id)) return null;
      }
    }

    return pga;
  }
}
