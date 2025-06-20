import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrioridadeAcao } from '@prisma/client';
import { CreatePriorityActionDto } from './dto/create-priority-action.dto';
import { UpdatePriorityActionDto } from './dto/update-priority-action.dto';

@Injectable()
export class PriorityActionRepository extends BaseRepository<PrioridadeAcao> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreatePriorityActionDto) {
    return this.prisma.prioridadeAcao.create({
      data
    });
  }

  async findAll() {
    return this.prisma.prioridadeAcao.findMany({
      where: this.whereActive(),
      orderBy: { grau: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.prioridadeAcao.findFirst({
      where: this.whereActive({ prioridade_id: id }),
    });
  }

  async update(id: number, data: UpdatePriorityActionDto) {
    return this.prisma.prioridadeAcao.update({
      where: { prioridade_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.prioridadeAcao.update({
      where: { prioridade_id: id },
      data: { ativo: false },
    });
  }
}