import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../course.repository';

@Injectable()
export class DeleteCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(id: number): Promise<void> {
    const course = await this.repository.findOne(id);
    if (!course) throw new NotFoundException('Curso não encontrado');
    await this.repository.delete(id);
  }
}