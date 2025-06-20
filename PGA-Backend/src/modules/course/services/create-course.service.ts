import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../course.repository';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Course } from '../entities/course.entity';

@Injectable()
export class CreateCourseService {
  constructor(private readonly repository: CourseRepository) {}

  async execute(data: CreateCourseDto): Promise<Course> {
    return this.repository.create(data);
  }
}
