import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { EixoTematico } from '@prisma/client';
import { CreateThematicAxisDto } from './dto/create-thematicAxis.dto';
import { UpdateThematicAxisDto } from './dto/update-thematicAxis.dto';

@Injectable()
export class ThematicAxisRepository extends BaseRepository<EixoTematico> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateThematicAxisDto) {
    return this.prisma.eixoTematico.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.eixoTematico.findMany({
      where: this.whereActive(),
      include: {
        temas: {
          where: this.whereActive(),
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.eixoTematico.findFirst({
      where: this.whereActive({ eixo_id: id }),
      include: {
        temas: {
          where: this.whereActive(),
        },
      },
    });
  }

  async update(id: number, data: UpdateThematicAxisDto) {
    return this.prisma.eixoTematico.update({
      where: { eixo_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.eixoTematico.update({
      where: { eixo_id: id },
      data: { ativo: false },
    });
  }
}
