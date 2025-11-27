import { Injectable } from '@nestjs/common';
import { Prisma, StatusPGA, StatusProjetoRegional } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class RegionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async getRegionalUnitIds(regionalId: number): Promise<number[]> {
    const vinculos = await this.prisma.pessoaUnidade.findMany({
      where: {
        pessoa_id: regionalId,
        ativo: true,
      },
      select: { unidade_id: true },
    });

    return vinculos.map((vinculo) => vinculo.unidade_id);
  }

  async findUnitsByRegional(regionalId: number) {
    return this.prisma.unidade.findMany({
      where: {
        regional_id: regionalId,
        ativo: true,
      },
      orderBy: { nome_unidade: 'asc' },
    });
  }

  async findPgasByRegional(
    regionalId: number,
    filters: { status?: StatusPGA; unidadeId?: number } = {},
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

    const unidadeFilter: number | { in: number[] } = { in: unidadeIds };

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

  async findPgaForRegional(regionalId: number, pgaId: number) {
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
    pgaId: number,
    data: { status: StatusPGA; parecer?: string; regionalId: number },
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
    regionalId: number,
    filters: {
      status?: StatusProjetoRegional;
      pgaId?: number;
      unidadeId?: number;
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

    let unidadeFilter: number | { in: number[] } = { in: unidadeIds };

    if (filters.unidadeId) {
      const existingPga = (where.pga ?? {}) as Prisma.PGAWhereInput;
      where.pga = {
        ...existingPga,
        unidade_id: { equals: filters.unidadeId },
      };
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

  async findProjectForRegional(regionalId: number, projetoId: number) {
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
    projetoId: number,
    data: {
      status: StatusProjetoRegional;
      parecer?: string;
      regionalId: number;
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

  async findRegionalByResponsavelId(pessoaId: number) {
    return this.prisma.regional.findFirst({
      where: {
        responsavel_id: pessoaId,
        ativo: true,
      },
    });
  }

  async findById(regionalId: number) {
    return this.prisma.regional.findUnique({
      where: { regional_id: regionalId },
    });
  }

  async create(data: Prisma.RegionalCreateInput) {
    return this.prisma.regional.create({ data });
  }
}
