import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateCpaActionDto } from './dto/create-cpa-action.dto';
import { UpdateCpaActionDto } from './dto/update-cpa-action.dto';

@Injectable()
export class CpaActionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCpaActionDto) {
    return this.prisma.acaoCPA.create({ data });
  }

  async findAll() {
    return this.prisma.acaoCPA.findMany();
  }

  async findOne(id: number) {
    return this.prisma.acaoCPA.findUnique({ where: { acao_cpa_id: id } });
  }

  async update(id: number, data: UpdateCpaActionDto) {
    return this.prisma.acaoCPA.update({
      where: { acao_cpa_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.acaoCPA.delete({ where: { acao_cpa_id: id } });
  }
}