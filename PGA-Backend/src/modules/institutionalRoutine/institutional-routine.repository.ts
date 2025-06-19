import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateInstitutionalRoutineDto } from './dto/create-institutional-routine.dto';
import { UpdateInstitutionalRoutineDto } from './dto/update-institutional-routine.dto';

@Injectable()
export class InstitutionalRoutineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.create({ data });
  }

  async findAll() {
    return this.prisma.rotinaInstitucional.findMany();
  }

  async findOne(id: number) {
    return this.prisma.rotinaInstitucional.findUnique({ where: { rotina_id: id } });
  }

  async update(id: number, data: UpdateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.update({
      where: { rotina_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.rotinaInstitucional.delete({ where: { rotina_id: id } });
  }
}