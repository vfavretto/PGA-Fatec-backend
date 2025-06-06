import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateRoutineOccurrenceDto } from './dto/create-routine-occurrence.dto';
import { UpdateRoutineOccurrenceDto } from './dto/update-routine-occurrence.dto';

@Injectable()
export class RoutineOccurrenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoutineOccurrenceDto) {
    return this.prisma.rotinaOcorrencia.create({ data });
  }

  async findAll() {
    return this.prisma.rotinaOcorrencia.findMany();
  }

  async findOne(id: number) {
    return this.prisma.rotinaOcorrencia.findUnique({ where: { ocorrencia_id: id } });
  }

  async update(id: number, data: UpdateRoutineOccurrenceDto) {
    return this.prisma.rotinaOcorrencia.update({
      where: { ocorrencia_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.rotinaOcorrencia.delete({ where: { ocorrencia_id: id } });
  }
}