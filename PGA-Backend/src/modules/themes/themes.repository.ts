import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Tema } from '@prisma/client';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemesRepository extends BaseRepository<Tema> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateThemeDto) {
    return this.prisma.tema.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.tema.findMany({
      where: this.whereActive(),
      include: {
        eixo: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.tema.findFirst({
      where: this.whereActive({ tema_id: id }),
      include: {
        eixo: true,
      },
    });
  }

  async update(id: number, data: UpdateThemeDto) {
    return this.prisma.tema.update({
      where: { tema_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.tema.update({
      where: { tema_id: id },
      data: { ativo: false },
    });
  }
}
