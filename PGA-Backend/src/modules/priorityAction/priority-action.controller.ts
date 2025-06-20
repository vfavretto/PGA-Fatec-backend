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
import { CreatePriorityActionService } from './services/create-priority-action.service';
import { FindAllPriorityActionService } from './services/find-all-priority-action.service';
import { FindOnePriorityActionService } from './services/find-one-priority-action.service';
import { UpdatePriorityActionService } from './services/update-priority-action.service';
import { DeletePriorityActionService } from './services/delete-priority-action.service';
import { CreatePriorityActionDto } from './dto/create-priority-action.dto';
import { UpdatePriorityActionDto } from './dto/update-priority-action.dto';

@Controller('priority-action')
export class PriorityActionController {
  constructor(
    private readonly createService: CreatePriorityActionService,
    private readonly findAllService: FindAllPriorityActionService,
    private readonly findOneService: FindOnePriorityActionService,
    private readonly updateService: UpdatePriorityActionService,
    private readonly deleteService: DeletePriorityActionService,
  ) {}

  @Post()
  create(@Body() dto: CreatePriorityActionDto) {
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
    @Body() dto: UpdatePriorityActionDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
