import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseService } from './services/create-course.service';
import { FindAllCourseService } from './services/find-all-course.service';
import { FindOneCourseService } from './services/find-one-course.service';
import { UpdateCourseService } from './services/update-course.service';
import { DeleteCourseService } from './services/delete-course.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly createService: CreateCourseService,
    private readonly findAllService: FindAllCourseService,
    private readonly findOneService: FindOneCourseService,
    private readonly updateService: UpdateCourseService,
    private readonly deleteService: DeleteCourseService,
  ) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.createService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}