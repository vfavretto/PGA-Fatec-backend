import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateWorkloadHaeService } from './services/create-workload-hae.service';
import { FindAllWorkloadHaeService } from './services/find-all-workload-hae.service';
import { FindOneWorkloadHaeService } from './services/find-one-workload-hae.service';
import { UpdateWorkloadHaeService } from './services/update-workload-hae.service';
import { DeleteWorkloadHaeService } from './services/delete-workload-hae.service';
import { CreateWorkloadHaeDto } from './dto/create-workload-hae.dto';
import { UpdateWorkloadHaeDto } from './dto/update-workload-hae.dto';

@Controller('workload-hae')
export class WorkloadHaeController {
  constructor(
    private readonly createService: CreateWorkloadHaeService,
    private readonly findAllService: FindAllWorkloadHaeService,
    private readonly findOneService: FindOneWorkloadHaeService,
    private readonly updateService: UpdateWorkloadHaeService,
    private readonly deleteService: DeleteWorkloadHaeService,
  ) {}

  @Post()
  create(@Body() dto: CreateWorkloadHaeDto) {
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
    @Body() dto: UpdateWorkloadHaeDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
