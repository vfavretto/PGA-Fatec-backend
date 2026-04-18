import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { AcaoProjeto } from '@prisma/client';
import { CreateProject1Dto } from './dto/create-project1.dto';
import { UpdateProject1Dto } from './dto/update-project1.dto';

@Injectable()
export class Project1Repository extends BaseRepository<AcaoProjeto> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProject1Dto) {
    return this.prisma.acaoProjeto.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive(),
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        tema: true,
        regionalResponsavel: true,
        etapas: {
          where: this.whereActive(),
        },
        pessoas: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive({ pga: { unidade_id: unidadeId } }),
      include: {
        eixo: true,
        pga: { include: { unidade: true } },
        prioridade: true,
        tema: true,
        regionalResponsavel: true,
        etapas: { where: this.whereActive() },
        pessoas: { where: this.whereActive(), include: { pessoa: true } },
        situacoesProblemas: { where: this.whereActive(), include: { situacaoProblema: true } },
      },
      orderBy: [{ pga: { ano: 'desc' } }, { codigo_projeto: 'asc' }],
    });
  }

  async findAllByRegional(regionalId: number) {
    const vinculos = await this.prisma.pessoaUnidade.findMany({
      where: { pessoa_id: regionalId, ativo: true },
      select: { unidade_id: true },
    });
    const unidadeIds = vinculos.map((v) => v.unidade_id);
    if (!unidadeIds.length) return [];

    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive({ pga: { unidade_id: { in: unidadeIds } } }),
      include: {
        eixo: true,
        pga: { include: { unidade: true } },
        prioridade: true,
        tema: true,
        regionalResponsavel: true,
        etapas: { where: this.whereActive() },
        pessoas: { where: this.whereActive(), include: { pessoa: true } },
        situacoesProblemas: { where: this.whereActive(), include: { situacaoProblema: true } },
      },
      orderBy: [{ pga: { ano: 'desc' } }, { codigo_projeto: 'asc' }],
    });
  }

  async findOneWithContext(id: number, active_context?: { tipo: string; id?: number } | null) {
    const projeto = await this.findOne(id);
    if (!projeto) return null;

    if (active_context) {
      if (active_context.tipo === 'unidade') {
        if (projeto.pga.unidade_id !== Number(active_context.id)) return null;
      }

      if (active_context.tipo === 'regional') {
        const vinculos = await this.prisma.pessoaUnidade.findMany({
          where: { pessoa_id: Number(active_context.id), ativo: true },
          select: { unidade_id: true },
        });
        const ids = vinculos.map((v) => v.unidade_id);
        if (!ids.includes(projeto.pga.unidade_id)) return null;
      }
    }

    return projeto;
  }

  async findOne(id: number) {
    return this.prisma.acaoProjeto.findFirst({
      where: this.whereActive({ acao_projeto_id: id }),
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        tema: true,
        regionalResponsavel: true,
        etapas: {
          where: this.whereActive(),
        },
        pessoas: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateProject1Dto) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: id },
      data: data as any,
    });
  }

  async delete(id: number) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: id },
      data: { ativo: false },
    });
  }

  async findByPgaId(pgaId: number) {
    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive({ pga_id: pgaId }),
      include: {
        eixo: true,
        prioridade: true,
        tema: true,
        regionalResponsavel: true,
      },
    });
  }
}
