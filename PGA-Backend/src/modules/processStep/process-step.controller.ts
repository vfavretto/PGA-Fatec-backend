import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateProcessStepDto } from './dto/create-process-step.dto';
import { UpdateProcessStepDto } from './dto/update-process-step.dto';
import { CreateProcessStepService } from './services/create-process-step.service';
import { FindAllProcessStepService } from './services/find-all-process-step.service';
import { FindOneProcessStepService } from './services/find-one-process-step.service';
import { UpdateProcessStepService } from './services/update-process-step.service';
import { DeleteProcessStepService } from './services/delete-process-step.service';

@Controller('process-step')
export class ProcessStepController {
  constructor(
    private readonly createService: CreateProcessStepService,
    private readonly findAllService: FindAllProcessStepService,
    private readonly findOneService: FindOneProcessStepService,
    private readonly updateService: UpdateProcessStepService,
    private readonly deleteService: DeleteProcessStepService,
  ) {}

  @Post()
  create(@Body() dto: CreateProcessStepDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProcessStepDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}