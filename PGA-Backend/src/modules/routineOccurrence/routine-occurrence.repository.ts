import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { RotinaOcorrencia } from '@prisma/client';
import { CreateRoutineOccurrenceDto } from './dto/create-routine-occurrence.dto';
import { UpdateRoutineOccurrenceDto } from './dto/update-routine-occurrence.dto';

@Injectable()
export class RoutineOccurrenceRepository extends BaseRepository<RotinaOcorrencia> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateRoutineOccurrenceDto) {
    return this.prisma.rotinaOcorrencia.create({
      data
    });
  }

  async findAll() {
    return this.prisma.rotinaOcorrencia.findMany({
      where: this.whereActive(),
      include: {
        rotina: true
      },
      orderBy: {
        data_realizacao: 'desc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.rotinaOcorrencia.findFirst({
      where: this.whereActive({ ocorrencia_id: id }),
      include: {
        rotina: true
      }
    });
  }

  async update(id: number, data: UpdateRoutineOccurrenceDto) {
    return this.prisma.rotinaOcorrencia.update({
      where: { ocorrencia_id: id },
      data
    });
  }

  async softDelete(id: number) {
    return this.prisma.rotinaOcorrencia.update({
      where: { ocorrencia_id: id },
      data: { ativo: false }
    });
  }

  async findByRoutineId(routineId: number) {
    return this.prisma.rotinaOcorrencia.findMany({
      where: this.whereActive({ rotina_id: routineId }),
      orderBy: {
        data_realizacao: 'desc'
      }
    });
  }
}