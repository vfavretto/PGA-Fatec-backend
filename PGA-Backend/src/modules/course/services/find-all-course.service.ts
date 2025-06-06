import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { Course } from '../entities/course.entity';

@Injectable()
export class FindAllCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(): Promise<Course[]> {
    return this.repository.findAll();
  }
}