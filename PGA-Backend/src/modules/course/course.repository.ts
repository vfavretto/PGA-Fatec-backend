import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    return this.prisma.curso.create({ data });
  }

  async findAll() {
    return this.prisma.curso.findMany();
  }

  async findOne(id: number) {
    return this.prisma.curso.findUnique({ where: { curso_id: id } });
  }

  async update(id: number, data: UpdateCourseDto) {
    return this.prisma.curso.update({
      where: { curso_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.curso.delete({ where: { curso_id: id } });
  }
}