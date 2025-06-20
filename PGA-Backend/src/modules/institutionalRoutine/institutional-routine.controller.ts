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
import { CreateInstitutionalRoutineDto } from './dto/create-institutional-routine.dto';
import { UpdateInstitutionalRoutineDto } from './dto/update-institutional-routine.dto';
import { CreateInstitutionalRoutineService } from './services/create-institutional-routine.service';
import { FindAllInstitutionalRoutineService } from './services/find-all-institutional-routine.service';
import { FindOneInstitutionalRoutineService } from './services/find-one-institutional-routine.service';
import { UpdateInstitutionalRoutineService } from './services/update-institutional-routine.service';
import { DeleteInstitutionalRoutineService } from './services/delete-institutional-routine.service';

@Controller('institutional-routine')
export class InstitutionalRoutineController {
  constructor(
    private readonly createService: CreateInstitutionalRoutineService,
    private readonly findAllService: FindAllInstitutionalRoutineService,
    private readonly findOneService: FindOneInstitutionalRoutineService,
    private readonly updateService: UpdateInstitutionalRoutineService,
    private readonly deleteService: DeleteInstitutionalRoutineService,
  ) {}

  @Post()
  create(@Body() dto: CreateInstitutionalRoutineDto) {
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
    @Body() dto: UpdateInstitutionalRoutineDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
