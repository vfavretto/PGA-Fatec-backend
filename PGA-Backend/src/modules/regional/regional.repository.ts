import { Injectable } from '@nestjs/common';
import { Prisma, StatusPGA, StatusProjetoRegional } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class RegionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async getRegionalUnitIds(pessoaId: string): Promise<string[]> {
    // pessoaId = pessoa_id do usuário Regional (active_context.id quando tipo='regional')
    // Busca via pessoaRegional: pessoa -> regionais -> unidades
    const vinculos = await this.prisma.pessoaRegional.findMany({
      where: { pessoa_id: pessoaId, ativo: true },
      include: {
        regional: {
          select: {
            unidades: {
              where: { ativo: true },
              select: { unidade_id: true },
            },
          },
        },
      },
    });

    return vinculos.flatMap((v) => v.regional.unidades.map((u) => u.unidade_id));
  }

  async findUnitsByRegional(regionalId: string) {
    return this.prisma.unidade.findMany({
      where: {
        regional_id: regionalId,
        ativo: true,
      },
      orderBy: { nome_unidade: 'asc' },
    });
  }

  async findPgasByRegional(
    regionalId: string,
    filters: { status?: StatusPGA; unidadeId?: string } = {},
  ) {
    const unidadeIds = await this.getRegionalUnitIds(regionalId);

    if (filters.unidadeId) {
      const where: Prisma.PGAWhereInput = {
        ativo: true,
        unidade_id: filters.unidadeId,
      };

      if (filters.status) {
        where.status = filters.status;
      }

      return this.prisma.pGA.findMany({
        where,
        include: {
          unidade: true,
          regionalResponsavel: true,
          usuarioCriacao: true,
        },
        orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
      });
    }

    if (!unidadeIds.length) {
      return [];
    }

    const unidadeFilter: string | { in: string[] } = { in: unidadeIds };

    const where: Prisma.PGAWhereInput = {
      ativo: true,
      unidade_id: unidadeFilter,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.pGA.findMany({
      where,
      include: {
        unidade: true,
        regionalResponsavel: true,
        usuarioCriacao: true,
      },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findPgaForRegional(regionalId: string, pgaId: string) {
    const unidadeIds = await this.getRegionalUnitIds(regionalId);

    if (!unidadeIds.length) {
      return null;
    }

    return this.prisma.pGA.findFirst({
      where: {
        ativo: true,
        pga_id: pgaId,
        unidade_id: { in: unidadeIds },
      },
      include: {
        unidade: true,
        regionalResponsavel: true,
        usuarioCriacao: true,
        acoesProjetos: {
          where: { ativo: true },
          include: {
            regionalResponsavel: true,
          },
        },
      },
    });
  }

  async updatePgaReview(
    pgaId: string,
    data: { status: StatusPGA; parecer?: string; regionalId: string },
  ) {
    return this.prisma.pGA.update({
      where: { pga_id: pgaId },
      data: {
        status: data.status,
        parecer_regional: data.parecer ?? null,
        data_parecer_regional: new Date(),
        regional_responsavel_id: data.regionalId,
      },
      include: {
        unidade: true,
        regionalResponsavel: true,
        usuarioCriacao: true,
      },
    });
  }

  async findProjectsByRegional(
    regionalId: string,
    filters: {
      status?: StatusProjetoRegional;
      pgaId?: string;
      unidadeId?: string;
    } = {},
  ) {
    const unidadeIds = await this.getRegionalUnitIds(regionalId);

    if (
      filters.unidadeId &&
      (!unidadeIds.length || !unidadeIds.includes(filters.unidadeId))
    ) {
      const whereByUnit: Prisma.AcaoProjetoWhereInput = {
        ativo: true,
        pga: {
          unidade_id: { equals: filters.unidadeId },
        },
      };

      if (filters.pgaId) {
        whereByUnit.pga_id = filters.pgaId;
      }

      if (filters.status) {
        whereByUnit.status_regional = filters.status;
      }

      return this.prisma.acaoProjeto.findMany({
        where: whereByUnit,
        include: {
          pga: { include: { unidade: true } },
          regionalResponsavel: true,
          eixo: true,
          tema: true,
          prioridade: true,
        },
        orderBy: [{ pga: { ano: 'desc' } }, { codigo_projeto: 'asc' }],
      });
    }

    if (!unidadeIds.length) {
      return [];
    }

    let unidadeFilter: string | { in: string[] } = { in: unidadeIds };

    if (filters.unidadeId) {
      unidadeFilter = filters.unidadeId;
    }

    const where: Prisma.AcaoProjetoWhereInput = {
      ativo: true,
      pga: {
        unidade_id: unidadeFilter,
      },
    };

    if (filters.pgaId) {
      where.pga_id = filters.pgaId;
    }

    if (filters.status) {
      where.status_regional = filters.status;
    }

    return this.prisma.acaoProjeto.findMany({
      where,
      include: {
        pga: {
          include: {
            unidade: true,
          },
        },
        regionalResponsavel: true,
        eixo: true,
        tema: true,
        prioridade: true,
      },
      orderBy: [{ pga: { ano: 'desc' } }, { codigo_projeto: 'asc' }],
    });
  }

  async findProjectForRegional(regionalId: string, projetoId: string) {
    const unidadeIds = await this.getRegionalUnitIds(regionalId);

    if (!unidadeIds.length) {
      return null;
    }

    return this.prisma.acaoProjeto.findFirst({
      where: {
        ativo: true,
        acao_projeto_id: projetoId,
        pga: {
          unidade_id: { in: unidadeIds },
        },
      },
      include: {
        pga: {
          include: {
            unidade: true,
          },
        },
        regionalResponsavel: true,
        eixo: true,
        tema: true,
        prioridade: true,
        situacoesProblemas: {
          where: { ativo: true },
          include: {
            situacaoProblema: true,
          },
        },
        etapas: {
          where: { ativo: true },
        },
        pessoas: {
          where: { ativo: true },
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async updateProjectReview(
    projetoId: string,
    data: {
      status: StatusProjetoRegional;
      parecer?: string;
      regionalId: string;
    },
  ) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: projetoId },
      data: {
        status_regional: data.status,
        parecer_regional: data.parecer ?? null,
        data_parecer_regional: new Date(),
        regional_responsavel_id: data.regionalId,
      },
      include: {
        pga: {
          include: {
            unidade: true,
          },
        },
        regionalResponsavel: true,
        eixo: true,
        tema: true,
        prioridade: true,
      },
    });
  }

  async findAll() {
    const regionais = await this.prisma.regional.findMany({
      where: { ativo: true },
      select: {
        regional_id: true,
        nome_regional: true,
        codigo_regional: true,
        responsavel_id: true,
        responsavel: {
          select: {
            pessoa_id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { nome_regional: 'asc' },
    });

    return regionais.map((r) => ({
      ...r,
      pessoa_id: r.responsavel_id ?? null,
      nome: r.nome_regional,
    }));
  }

  async findRegionalByResponsavelId(pessoaId: string) {
    return this.prisma.regional.findFirst({
      where: {
        responsavel_id: pessoaId,
        ativo: true,
      },
    });
  }

  async findById(regionalId: string) {
    return this.prisma.regional.findUnique({
      where: { regional_id: regionalId },
    });
  }

  async create(data: Prisma.RegionalCreateInput) {
    return this.prisma.regional.create({ data });
  }
}
