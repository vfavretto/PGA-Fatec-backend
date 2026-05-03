import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PGA, Prisma } from '@prisma/client';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';

@Injectable()
export class PgaRepository extends BaseRepository<PGA> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreatePgaDto & { is_template?: boolean; usuario_criacao_id?: string | null }) {
    return this.prisma.pGA.create({
      data,
    });
  }

  private readonly unidadeInclude = {
    include: {
      diretor: { select: { nome: true } },
    },
  };

  // findAll inclui templates (para Admin/CPS sem contexto)
  async findAll() {
    return this.prisma.pGA.findMany({
      where: this.whereActive(),
      include: {
        unidade: this.unidadeInclude,
        regionalResponsavel: true,
      },
      orderBy: [{ is_template: 'desc' }, { ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findAllByUnit(unidadeId: string, includeTemplates = false) {
    return this.prisma.pGA.findMany({
      where: this.whereActive({
        unidade_id: unidadeId,
        ...(includeTemplates ? {} : { is_template: false }),
      }),
      include: { unidade: this.unidadeInclude, regionalResponsavel: true },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findAllByRegional(regionalId: string) {
    const vinculos = await this.prisma.pessoaRegional.findMany({
      where: { pessoa_id: regionalId, ativo: true },
      include: { regional: { select: { unidades: { where: { ativo: true }, select: { unidade_id: true } } } } },
    });

    const unidadeIds = vinculos.flatMap((v) =>
      v.regional.unidades.map((u) => u.unidade_id),
    );
    if (!unidadeIds.length) return [];

    return this.prisma.pGA.findMany({
      where: this.whereActive({ unidade_id: { in: unidadeIds }, is_template: false }),
      include: { unidade: this.unidadeInclude, regionalResponsavel: true },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_unidade: 'asc' } }],
    });
  }

  async findOne(id: string) {
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

  async findOneWithRelations(id: string) {
    return this.prisma.pGA.findFirst({
      where: this.whereActive({ pga_id: id }),
      include: {
        unidade: {
          include: {
            diretor: { select: { nome: true, telefone: true, email: true } },
            cursos: {
              where: { ativo: true },
              include: {
                coordenador: { select: { nome: true, telefone: true, email: true } },
              },
              orderBy: [{ nome: 'asc' }],
            },
            pessoas: {
              where: { ativo: true },
              include: {
                pessoa: { select: { nome: true, telefone: true, email: true } },
              },
            },
          },
        },
        regionalResponsavel: true,
        situacoesProblemas: {
          where: this.whereActive(),
          include: { situacaoProblema: true },
        },
        acoesProjetos: {
          where: { ativo: true },
          include: {
            eixo: true,
            tema: true,
            prioridade: true,
            situacoesProblemas: { include: { situacaoProblema: true } },
            etapas: {
              where: { ativo: true },
              include: { entregavel_link_sei: true, anexos: { where: { ativo: true } } },
            },
            pessoas: {
              where: { ativo: true },
              include: { pessoa: true, tipo_vinculo_hae: true },
            },
          },
          orderBy: [{ codigo_projeto: 'asc' }],
        },
        acoesCPA: {
          where: { ativo: true },
          orderBy: [{ acao_cpa_id: 'asc' }],
        },
        rotinas: {
          where: { ativo: true },
          include: {
            curso: true,
            responsavel: { select: { nome: true } },
            ocorrencias: {
              where: { ativo: true },
              orderBy: [{ data_realizacao: 'asc' }],
            },
            participantes: {
              where: { ativo: true },
              include: { pessoa: { select: { nome: true } } },
            },
          },
          orderBy: [{ tipo_rotina: 'asc' }, { titulo: 'asc' }],
        },
      },
    });
  }

  async update(id: string, data: UpdatePgaDto) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data,
    });
  }

  /**
   * Método dedicado para atualizações internas de fluxo (status, pareceres,
   * campos de auditoria) que não fazem parte do UpdatePgaDto público.
   * Aceita diretamente o tipo Prisma para garantir type-safety sem `as any`.
   */
  async updateWorkflow(id: string, data: Prisma.PGAUpdateInput) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data: { ativo: false } as any,
    });
  }

  async findByAnoAndUnidade(ano: number, unidadeId: string) {
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

  async findOneWithContext(id: string, active_context?: { tipo: string; id?: string } | null) {
    const pga = await this.findOne(id);
    if (!pga) return null;

    if (active_context) {
      if (active_context.tipo === 'unidade') {
        if (pga.unidade_id !== active_context.id) return null;
      }

      if (active_context.tipo === 'regional') {
        // Verifica se a unidade do PGA pertence à regional do usuário logado
        const vinculos = await this.prisma.pessoaRegional.findMany({
          where: { pessoa_id: active_context.id, ativo: true },
          select: { regional_id: true },
        });
        const regionalIds = vinculos.map((v) => v.regional_id);
        if (!pga.unidade_id) return null;
        const unidade = await this.prisma.unidade.findUnique({
          where: { unidade_id: pga.unidade_id },
          select: { regional_id: true },
        });
        if (!unidade || !unidade.regional_id || !regionalIds.includes(unidade.regional_id)) return null;
      }
    }

    return pga;
  }
}
