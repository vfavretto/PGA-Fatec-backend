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
import { CreateRoutineParticipantDto } from './dto/create-routine-participant.dto';
import { UpdateRoutineParticipantDto } from './dto/update-routine-participant.dto';
import { CreateRoutineParticipantService } from './services/create-routine-participant.service';
import { FindAllRoutineParticipantService } from './services/find-all-routine-participant.service';
import { FindOneRoutineParticipantService } from './services/find-one-routine-participant.service';
import { UpdateRoutineParticipantService } from './services/update-routine-participant.service';
import { DeleteRoutineParticipantService } from './services/delete-routine-participant.service';

@Controller('routine-participant')
export class RoutineParticipantController {
  constructor(
    private readonly createService: CreateRoutineParticipantService,
    private readonly findAllService: FindAllRoutineParticipantService,
    private readonly findOneService: FindOneRoutineParticipantService,
    private readonly updateService: UpdateRoutineParticipantService,
    private readonly deleteService: DeleteRoutineParticipantService,
  ) {}

  @Post()
  create(@Body() dto: CreateRoutineParticipantDto) {
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
    @Body() dto: UpdateRoutineParticipantDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
