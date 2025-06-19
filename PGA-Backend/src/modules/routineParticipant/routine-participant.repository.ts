import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateRoutineParticipantDto } from './dto/create-routine-participant.dto';
import { UpdateRoutineParticipantDto } from './dto/update-routine-participant.dto';

@Injectable()
export class RoutineParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoutineParticipantDto) {
    return this.prisma.rotinaParticipante.create({ data });
  }

  async findAll() {
    return this.prisma.rotinaParticipante.findMany();
  }

  async findOne(id: number) {
    return this.prisma.rotinaParticipante.findUnique({ where: { rotina_participante_id: id } });
  }

  async update(id: number, data: UpdateRoutineParticipantDto) {
    return this.prisma.rotinaParticipante.update({
      where: { rotina_participante_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.rotinaParticipante.delete({ where: { rotina_participante_id: id } });
  }
}