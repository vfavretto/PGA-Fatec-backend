import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProcessStepDto } from './dto/create-process-step.dto';
import { UpdateProcessStepDto } from './dto/update-process-step.dto';

@Injectable()
export class ProcessStepRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProcessStepDto) {
    return this.prisma.etapaProcesso.create({ data });
  }

  async findAll() {
    return this.prisma.etapaProcesso.findMany();
  }

  async findOne(id: number) {
    return this.prisma.etapaProcesso.findUnique({ where: { etapa_id: id } });
  }

  async update(id: number, data: UpdateProcessStepDto) {
    return this.prisma.etapaProcesso.update({
      where: { etapa_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.etapaProcesso.delete({ where: { etapa_id: id } });
  }
}