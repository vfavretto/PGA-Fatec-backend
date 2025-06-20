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
import { CreateCpaActionDto } from './dto/create-cpa-action.dto';
import { UpdateCpaActionDto } from './dto/update-cpa-action.dto';
import { CreateCpaActionService } from './services/create-cpa-action.service';
import { FindAllCpaActionService } from './services/find-all-cpa-action.service';
import { FindOneCpaActionService } from './services/find-one-cpa-action.service';
import { UpdateCpaActionService } from './services/update-cpa-action.service';
import { DeleteCpaActionService } from './services/delete-cpa-action.service';

@Controller('cpa-action')
export class CpaActionController {
  constructor(
    private readonly createService: CreateCpaActionService,
    private readonly findAllService: FindAllCpaActionService,
    private readonly findOneService: FindOneCpaActionService,
    private readonly updateService: UpdateCpaActionService,
    private readonly deleteService: DeleteCpaActionService,
  ) {}

  @Post()
  create(@Body() dto: CreateCpaActionDto) {
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
    @Body() dto: UpdateCpaActionDto,
  ) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
