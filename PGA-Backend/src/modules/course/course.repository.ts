import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Curso } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseRepository extends BaseRepository<Curso> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateCourseDto) {
    return this.prisma.curso.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.curso.findMany({
      where: this.whereActive(),
      include: {
        coordenador: true,
        unidade: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.curso.findFirst({
      where: this.whereActive({ curso_id: id }),
      include: {
        coordenador: true,
        unidade: true,
      },
    });
  }

  async update(id: number, data: UpdateCourseDto) {
    return this.prisma.curso.update({
      where: { curso_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.curso.update({
      where: { curso_id: id },
      data: { ativo: false },
    });
  }

  async findByUnitId(unitId: number) {
    return this.prisma.curso.findMany({
      where: this.whereActive({ unidade_id: unitId }),
      include: {
        coordenador: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }
}
