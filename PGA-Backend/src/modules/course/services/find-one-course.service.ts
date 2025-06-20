import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { Course } from '../entities/course.entity';

@Injectable()
export class FindOneCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(id: number): Promise<Course> {
    const course = await this.repository.findOne(id);
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }
}
