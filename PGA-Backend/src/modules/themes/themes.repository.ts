import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateThemeDto) {
    return this.prisma.tema.create({ data });
  }

  async findAll() {
    return this.prisma.tema.findMany();
  }

  async findOne(id: number) {
    return this.prisma.tema.findUnique({ where: { tema_id: id } });
  }

  async update(id: number, data: UpdateThemeDto) {
    return this.prisma.tema.update({ where: { tema_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.tema.delete({ where: { tema_id: id } });
  }
}
