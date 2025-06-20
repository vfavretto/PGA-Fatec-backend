import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { RotinaParticipante } from '@prisma/client';
import { CreateRoutineParticipantDto } from './dto/create-routine-participant.dto';
import { UpdateRoutineParticipantDto } from './dto/update-routine-participant.dto';

@Injectable()
export class RoutineParticipantRepository extends BaseRepository<RotinaParticipante> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateRoutineParticipantDto) {
    return this.prisma.rotinaParticipante.create({
      data
    });
  }

  async findAll() {
    return this.prisma.rotinaParticipante.findMany({
      where: this.whereActive(),
      include: {
        pessoa: true,
        rotina: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.rotinaParticipante.findFirst({
      where: this.whereActive({ rotina_participante_id: id }),
      include: {
        pessoa: true,
        rotina: true
      }
    });
  }

  async update(id: number, data: UpdateRoutineParticipantDto) {
    return this.prisma.rotinaParticipante.update({
      where: { rotina_participante_id: id },
      data
    });
  }

  async softDelete(id: number) {
    return this.prisma.rotinaParticipante.update({
      where: { rotina_participante_id: id },
      data: { ativo: false }
    });
  }

  async findByRoutineId(routineId: number) {
    return this.prisma.rotinaParticipante.findMany({
      where: this.whereActive({ rotina_id: routineId }),
      include: {
        pessoa: true
      }
    });
  }
}