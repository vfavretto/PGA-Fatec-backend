import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Unidade } from '@prisma/client';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitRepository extends BaseRepository<Unidade> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateUnitDto) {
    const payload: any = {};
    payload.codigo_fnnn = data.codigo_fnnn;
    payload.nome_unidade = data.nome_unidade;
    if (data.endereco !== undefined) payload.endereco = data.endereco;
    if (data.telefone !== undefined) payload.telefone = data.telefone;
    payload.regional_id = data.regional_id;
    if (data.diretor_id !== undefined) payload.diretor_id = data.diretor_id;

    return this.prisma.unidade.create({ data: payload });
  }

  async findAll() {
    return this.prisma.unidade.findMany({
      where: this.whereActive(),
      include: {
        cursos: {
          where: this.whereActive(),
        },
      },
      orderBy: { nome_unidade: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.unidade.findFirst({
      where: this.whereActive({ unidade_id: id }),
      include: {
        cursos: {
          where: this.whereActive(),
        },
      },
    });
  }

  async findOneWithContext(id: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.unidade.findFirst({
        where: this.whereActive({ AND: [{ unidade_id: id }, { unidade_id: active_context.id }] }),
        include: { cursos: { where: this.whereActive() } },
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      const vinculos = await this.prisma.pessoaUnidade.findMany({
        where: { pessoa_id: Number(active_context.id), ativo: true },
        select: { unidade_id: true },
      });
      const unidadeIds = vinculos.map((v) => v.unidade_id);
      if (!unidadeIds.length) return null;

      return this.prisma.unidade.findFirst({
        where: this.whereActive({ AND: [{ unidade_id: id }, { unidade_id: { in: unidadeIds } }] }),
        include: { cursos: { where: this.whereActive() } },
      });
    }

    return this.findOne(id);
  }

  async update(id: number, data: UpdateUnitDto) {
    return this.prisma.unidade.update({
      where: { unidade_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.unidade.update({
      where: { unidade_id: id },
      data: { ativo: false },
    });
  }

  async findAllByRegional(regionalId: number) {
    const vinculos = await this.prisma.pessoaUnidade.findMany({
      where: { pessoa_id: regionalId, ativo: true },
      select: { unidade_id: true },
    });
    const unidadeIds = vinculos.map((v) => v.unidade_id);
    if (!unidadeIds.length) return [];

    return this.prisma.unidade.findMany({
      where: this.whereActive({ unidade_id: { in: unidadeIds } }),
      include: { cursos: { where: this.whereActive() } },
      orderBy: { nome_unidade: 'asc' },
    });
  }
}
