import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProjectPersonDto } from './dto/create-project-person.dto';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto';
import { CreateProjectPersonService } from './services/create-project-person.service';
import { FindAllProjectPersonService } from './services/find-all-project-person.service';
import { FindOneProjectPersonService } from './services/find-one-project-person.service';
import { UpdateProjectPersonService } from './services/update-project-person.service';
import { DeleteProjectPersonService } from './services/delete-project-person.service';

@Controller('project-person')
export class ProjectPersonController {
  constructor(
    private readonly createService: CreateProjectPersonService,
    private readonly findAllService: FindAllProjectPersonService,
    private readonly findOneService: FindOneProjectPersonService,
    private readonly updateService: UpdateProjectPersonService,
    private readonly deleteService: DeleteProjectPersonService,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectPersonDto) {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectPersonDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
