import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ProjetoPessoa } from '@prisma/client';
import { CreateProjectPersonDto } from './dto/create-project-person.dto';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto';

@Injectable()
export class ProjectPersonRepository extends BaseRepository<ProjetoPessoa> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProjectPersonDto) {
    return this.prisma.projetoPessoa.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive(),
      include: {
        pessoa: true,
        acaoProjeto: { include: { pga: true } },
        tipo_vinculo_hae: true,
      },
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive({ acao_projeto: { pga: { unidade_id: unidadeId } } }),
      include: { pessoa: true, acaoProjeto: { include: { pga: true } }, tipo_vinculo_hae: true },
    });
  }

  async findAllByRegional(regionalId: number) {
    const vinculos = await this.prisma.pessoaUnidade.findMany({
      where: { pessoa_id: regionalId, ativo: true },
      select: { unidade_id: true },
    });
    const unidadeIds = vinculos.map((v) => v.unidade_id);
    if (!unidadeIds.length) return [];

    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive({ acao_projeto: { pga: { unidade_id: { in: unidadeIds } } } }),
      include: { pessoa: true, acaoProjeto: { include: { pga: true } }, tipo_vinculo_hae: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.projetoPessoa.findFirst({
      where: this.whereActive({ projeto_pessoa_id: id }),
      include: {
        pessoa: true,
        acaoProjeto: { include: { pga: true } },
        tipo_vinculo_hae: true,
      },
    });
  }

  async findOneWithContext(id: number, active_context?: { tipo: string; id?: number } | null) {
    const item = await this.findOne(id);
    if (!item) return null;

    if (active_context) {
      if (active_context.tipo === 'unidade') {
        if (item.acaoProjeto.pga.unidade_id !== Number(active_context.id)) return null;
      }

      if (active_context.tipo === 'regional') {
        const vinculos = await this.prisma.pessoaUnidade.findMany({
          where: { pessoa_id: Number(active_context.id), ativo: true },
          select: { unidade_id: true },
        });
        const ids = vinculos.map((v) => v.unidade_id);
        if (!ids.includes(item.acaoProjeto.pga.unidade_id)) return null;
      }
    }

    return item;
  }

  async update(id: number, data: UpdateProjectPersonDto) {
    return this.prisma.projetoPessoa.update({
      where: { projeto_pessoa_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.projetoPessoa.update({
      where: { projeto_pessoa_id: id },
      data: { ativo: false },
    });
  }

  async findByProjectId(projetoId: number) {
    return this.prisma.projetoPessoa.findMany({
      where: this.whereActive({ acao_projeto_id: projetoId }),
      include: {
        pessoa: true,
        tipo_vinculo_hae: true,
      },
    });
  }

  async findByProjectIdWithContext(projetoId: number, active_context?: { tipo: string; id?: number } | null) {
    if (!active_context) return this.findByProjectId(projetoId);

    if (active_context.tipo === 'unidade') {
      return this.prisma.projetoPessoa.findMany({
        where: this.whereActive({ acao_projeto_id: projetoId, acao_projeto: { pga: { unidade_id: Number(active_context.id) } } }),
        include: { pessoa: true, tipo_vinculo_hae: true },
      });
    }

    if (active_context.tipo === 'regional') {
      const vinculos = await this.prisma.pessoaUnidade.findMany({
        where: { pessoa_id: Number(active_context.id), ativo: true },
        select: { unidade_id: true },
      });
      const unidadeIds = vinculos.map((v) => v.unidade_id);
      if (!unidadeIds.length) return [];

      return this.prisma.projetoPessoa.findMany({
        where: this.whereActive({ acao_projeto_id: projetoId, acao_projeto: { pga: { unidade_id: { in: unidadeIds } } } }),
        include: { pessoa: true, tipo_vinculo_hae: true },
      });
    }

    return this.findByProjectId(projetoId);
  }
}
