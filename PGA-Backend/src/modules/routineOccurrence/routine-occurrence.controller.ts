import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateRoutineOccurrenceDto } from './dto/create-routine-occurrence.dto';
import { UpdateRoutineOccurrenceDto } from './dto/update-routine-occurrence.dto';
import { CreateRoutineOccurrenceService } from './services/create-routine-occurrence.service';
import { FindAllRoutineOccurrenceService } from './services/find-all-routine-occurrence.service';
import { FindOneRoutineOccurrenceService } from './services/find-one-routine-occurrence.service';
import { UpdateRoutineOccurrenceService } from './services/update-routine-occurrence.service';
import { DeleteRoutineOccurrenceService } from './services/delete-routine-occurrence.service';

@Controller('routine-occurrence')
export class RoutineOccurrenceController {
  constructor(
    private readonly createService: CreateRoutineOccurrenceService,
    private readonly findAllService: FindAllRoutineOccurrenceService,
    private readonly findOneService: FindOneRoutineOccurrenceService,
    private readonly updateService: UpdateRoutineOccurrenceService,
    private readonly deleteService: DeleteRoutineOccurrenceService,
  ) {}

  @Post()
  create(@Body() dto: CreateRoutineOccurrenceDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoutineOccurrenceDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}