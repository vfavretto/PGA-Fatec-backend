import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CreateDeliverableService } from './services/create-deliverable.service';
import { FindAllDeliverableService } from './services/find-all-deliverable.service';
import { FindOneDeliverableService } from './services/find-one-deliverable.service';
import { UpdateDeliverableService } from './services/update-deliverable.service';
import { DeleteDeliverableService } from './services/delete-deliverable.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Controller('deliverable')
export class DeliverableController {
  constructor(
    private readonly createService: CreateDeliverableService,
    private readonly findAllService: FindAllDeliverableService,
    private readonly findOneService: FindOneDeliverableService,
    private readonly updateService: UpdateDeliverableService,
    private readonly deleteService: DeleteDeliverableService,
  ) {}

  @Post()
  create(@Body() dto: CreateDeliverableDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeliverableDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}