import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CreateProblemSituationService } from './services/create-problemSituation.service';
import { FindAllProblemSituationService } from './services/find-all-problemSituation.service';
import { FindOneProblemSituationService } from './services/find-one-problemSituation.service';
import { UpdateProblemSituationService } from './services/update-problemSituation.service';
import { DeleteProblemSituationService } from './services/delete-problemSituation.service';
import { CreateProblemSituationDto } from './dto/create-problemSituation.dto';
import { UpdateProblemSituationDto } from './dto/update-problemSituation.dto';

@Controller('problem-situation')
export class ProblemSituationController {
  constructor(
    private readonly createService: CreateProblemSituationService,
    private readonly findAllService: FindAllProblemSituationService,
    private readonly findOneService: FindOneProblemSituationService,
    private readonly updateService: UpdateProblemSituationService,
    private readonly deleteService: DeleteProblemSituationService,
  ) {}

  @Post()
  create(@Body() dto: CreateProblemSituationDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemSituationDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}