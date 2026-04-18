import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { RotinaInstitucional } from '@prisma/client';
import { CreateInstitutionalRoutineDto } from './dto/create-institutional-routine.dto';
import { UpdateInstitutionalRoutineDto } from './dto/update-institutional-routine.dto';

@Injectable()
export class InstitutionalRoutineRepository extends BaseRepository<RotinaInstitucional> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive(),
      include: {
        curso: true,
        pga: true,
        responsavel: true,
        ocorrencias: {
          where: this.whereActive(),
        },
        participantes: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.rotinaInstitucional.findFirst({
      where: this.whereActive({ rotina_id: id }),
      include: {
        curso: true,
        pga: true,
        responsavel: true,
        ocorrencias: {
          where: this.whereActive(),
        },
        participantes: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.update({
      where: { rotina_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.rotinaInstitucional.update({
      where: { rotina_id: id },
      data: { ativo: false },
    });
  }

  async findByPgaId(pgaId: number) {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive({ pga_id: pgaId }),
      include: {
        curso: true,
        responsavel: true,
      },
    });
  }

  async findAllByUnit(unidadeId: number) {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive({ unidade_id: unidadeId }),
      include: {
        curso: true,
        responsavel: true,
      },
    });
  }

  async findAllByRegional(regionalId: number) {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive({ regional_id: regionalId }),
      include: {
        curso: true,
        responsavel: true,
      },
    });
  }

  async findOneWithContext(id: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.rotinaInstitucional.findFirst({
        where: this.whereActive({ rotina_id: id, unidade_id: active_context.id }),
        include: { curso: true, responsavel: true },
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.prisma.rotinaInstitucional.findFirst({
        where: this.whereActive({ rotina_id: id, regional_id: active_context.id }),
        include: { curso: true, responsavel: true },
      });
    }

    return this.findOne(id);
  }

  async findByPgaIdWithContext(pgaId: number, active_context?: any) {
    if (active_context && active_context.tipo === 'unidade') {
      return this.prisma.rotinaInstitucional.findMany({
        where: this.whereActive({ pga_id: pgaId, unidade_id: active_context.id }),
        include: { curso: true, responsavel: true },
      });
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.prisma.rotinaInstitucional.findMany({
        where: this.whereActive({ pga_id: pgaId, regional_id: active_context.id }),
        include: { curso: true, responsavel: true },
      });
    }

    return this.findByPgaId(pgaId);
  }
}
