import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CreateCourseService } from './services/create-course.service';
import { FindAllCourseService } from './services/find-all-course.service';
import { FindOneCourseService } from './services/find-one-course.service';
import { UpdateCourseService } from './services/update-course.service';
import { DeleteCourseService } from './services/delete-course.service';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [
    CourseRepository,
    CreateCourseService,
    FindAllCourseService,
    FindOneCourseService,
    UpdateCourseService,
    DeleteCourseService,
  ],
  exports: [
    CourseRepository,
    CreateCourseService,
    FindAllCourseService,
    FindOneCourseService,
    UpdateCourseService,
    DeleteCourseService,
  ],
})
export class CourseModule {}