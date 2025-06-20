import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';

@Injectable()
export class VersionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSituacaoProblemaVersion(data: {
    situacao_base_id: number;
    ano: number;
    codigo_categoria: string;
    descricao: string;
    fonte?: string | null;
    ordem?: number | null;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.situacaoProblemaVersao.create({
      data: {
        ...data,
        fonte: data.fonte ?? undefined,
        ordem: data.ordem ?? undefined,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getSituacoesProblemaByYear(ano: number) {
    const versoes = await this.prisma.situacaoProblemaVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: { situacaoBase: true },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        situacao_id: v.situacao_base_id,
        codigo_categoria: v.codigo_categoria,
        descricao: v.descricao,
        fonte: v.fonte,
        ordem: v.ordem,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
      }));
    }

    return this.prisma.situacaoProblema.findMany({
      where: { ativo: true },
      orderBy: { codigo_categoria: 'asc' },
    });
  }

  async createEixoTematicoVersion(data: {
    eixo_base_id: number;
    ano: number;
    numero: number;
    nome: string;
    descricao?: string | null;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.eixoTematicoVersao.create({
      data: {
        ...data,
        descricao: data.descricao ?? undefined,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getEixosTematicosByYear(ano: number) {
    const versoes = await this.prisma.eixoTematicoVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: { eixoBase: true },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        eixo_id: v.eixo_base_id,
        numero: v.numero,
        nome: v.nome,
        descricao: v.descricao,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
      }));
    }

    return this.prisma.eixoTematico.findMany({
      where: { ativo: true },
      orderBy: { numero: 'asc' },
    });
  }

  async createPrioridadeAcaoVersion(data: {
    prioridade_base_id: number;
    ano: number;
    grau: number;
    descricao: string;
    tipo_gestao: string;
    detalhes?: string | null;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.prioridadeAcaoVersao.create({
      data: {
        ...data,
        detalhes: data.detalhes ?? undefined,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getPrioridadesByYear(ano: number) {
    const versoes = await this.prisma.prioridadeAcaoVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: { prioridadeBase: true },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        prioridade_id: v.prioridade_base_id,
        grau: v.grau,
        descricao: v.descricao,
        tipo_gestao: v.tipo_gestao,
        detalhes: v.detalhes,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
      }));
    }

    return this.prisma.prioridadeAcao.findMany({
      where: { ativo: true },
      orderBy: { grau: 'asc' },
    });
  }

  async createTemaVersion(data: {
    tema_base_id: number;
    ano: number;
    tema_num: number;
    eixo_id: number;
    descricao: string;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.temaVersao.create({
      data: {
        ...data,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getTemasByYear(ano: number) {
    const versoes = await this.prisma.temaVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: {
        temaBase: true,
        eixo: true,
      },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        tema_id: v.tema_base_id,
        tema_num: v.tema_num,
        eixo_id: v.eixo_id,
        descricao: v.descricao,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
        eixo: v.eixo,
      }));
    }

    return this.prisma.tema.findMany({
      where: { ativo: true },
      include: { eixo: true },
      orderBy: { tema_num: 'asc' },
    });
  }

  async createEntregavelVersion(data: {
    entregavel_base_id: number;
    ano: number;
    entregavel_numero: string;
    descricao: string;
    detalhes?: string | null;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.entregavelVersao.create({
      data: {
        ...data,
        detalhes: data.detalhes ?? undefined,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getEntregaveisByYear(ano: number) {
    const versoes = await this.prisma.entregavelVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: { entregavelBase: true },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        entregavel_id: v.entregavel_base_id,
        entregavel_numero: v.entregavel_numero,
        descricao: v.descricao,
        detalhes: v.detalhes,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
      }));
    }

    return this.prisma.entregavelLinkSei.findMany({
      where: { ativo: true },
      orderBy: { entregavel_numero: 'asc' },
    });
  }

  async createPessoaVersion(data: {
    pessoa_base_id: number;
    ano: number;
    nome: string;
    email?: string | null;
    tipo_usuario: any;
    criado_por?: number | null;
    motivo_alteracao?: string | null;
  }) {
    return this.prisma.pessoaVersao.create({
      data: {
        ...data,
        email: data.email ?? undefined,
        criado_por: data.criado_por ?? undefined,
        motivo_alteracao: data.motivo_alteracao ?? undefined,
      },
    });
  }

  async getPessoasByYear(ano: number) {
    const versoes = await this.prisma.pessoaVersao.findMany({
      where: { ano, ativo_no_ano: true },
      include: { pessoaBase: true },
    });

    if (versoes.length > 0) {
      return versoes.map((v) => ({
        pessoa_id: v.pessoa_base_id,
        nome: v.nome,
        email: v.email,
        tipo_usuario: v.tipo_usuario,
        ativo: v.ativo_no_ano,
        versao_id: v.versao_id,
        ano_versao: v.ano,
      }));
    }

    return this.prisma.pessoa.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }
}
