import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateThematicAxisDto } from './dto/create-thematicAxis.dto';
import { UpdateThematicAxisDto } from './dto/update-thematicAxis.dto';

@Injectable()
export class ThematicAxisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateThematicAxisDto) {
    return this.prisma.eixoTematico.create({ data });
  }

  async findAll() {
    return this.prisma.eixoTematico.findMany();
  }

  async findOne(id: number) {
    return this.prisma.eixoTematico.findUnique({ where: { eixo_id: id } });
  }

  async update(id: number, data: UpdateThematicAxisDto) {
    return this.prisma.eixoTematico.update({ where: { eixo_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.eixoTematico.delete({ where: { eixo_id: id } });
  }
}