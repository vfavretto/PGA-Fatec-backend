import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUnitDto) {
    return this.prisma.unidade.create({ data });
  }

  async findAll() {
    return this.prisma.unidade.findMany();
  }

  async findOne(id: number) {
    return this.prisma.unidade.findUnique({ where: { unidade_id: id } });
  }

  async update(id: number, data: UpdateUnitDto) {
    return this.prisma.unidade.update({ where: { unidade_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.unidade.delete({ where: { unidade_id: id } });
  }
}