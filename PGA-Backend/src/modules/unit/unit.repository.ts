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
    return this.prisma.unidade.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.unidade.findMany({
      where: this.whereActive(),
      include: {
        cursos: {
          where: this.whereActive(),
        },
      },
      orderBy: { nome_completo: 'asc' },
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
}
