import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';

@Injectable()
export class UpdateCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(id: string, data: UpdateCourseDto): Promise<Course> {
    const course = await this.repository.findOne(id);
    if (!course) throw new NotFoundException('Curso não encontrado');
    return this.repository.update(id, data);
  }
}
