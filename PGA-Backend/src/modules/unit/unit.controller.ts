import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { CreateUnitService } from './services/create-unit.service';
import { FindAllUnitsService } from './services/find-all-units.service';
import { FindOneUnitService } from './services/find-one-unit.service';
import { UpdateUnitService } from './services/update-unit.service';
import { DeleteUnitService} from './services/delete-unit.service';

@Controller('unit')
export class UnitController {
  constructor(
    private readonly createUnitService: CreateUnitService,
    private readonly findAllUnitsService: FindAllUnitsService,
    private readonly findOneUnitService: FindOneUnitService,
    private readonly updateUnitService: UpdateUnitService,
    private readonly deleteUnitService: DeleteUnitService,
  ) {}

  @Post()
  create(@Body() dto: CreateUnitDto) {
    return this.createUnitService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllUnitsService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneUnitService.execute(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.updateUnitService.execute(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUnitService.execute(Number(id));
  }
}