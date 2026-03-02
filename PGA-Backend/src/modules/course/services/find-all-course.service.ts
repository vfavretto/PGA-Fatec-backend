import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { Course } from '../entities/course.entity';

@Injectable()
export class FindAllCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(user?: any): Promise<Course[]> {
    const active_context = user?.active_context;

    if (active_context && active_context.tipo === 'unidade') {
      return this.repository.findByUnitId(active_context.id);
    }

    if (active_context && active_context.tipo === 'regional') {
      return this.repository.findAllByRegional(active_context.id);
    }

    return this.repository.findAll();
  }
}
