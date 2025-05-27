import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateThematicAxisDto } from './dto/create-thematicAxis.dto';
import { UpdateThematicAxisDto } from './dto/update-thematicAxis.dto';
import { CreateThematicAxisService } from './services/create-thematicAxis.service';
import { FindAllThematicAxisService } from './services/find-all-thematicAxis.service'
import { FindOneThematicAxisService } from './services/find-one-thematicAxis.service';
import { UpdateThematicAxisService } from './services/update-thematicAxis.service';
import { DeleteThematicAxisService } from './services/delete-thematicAxis.service';

@Controller('thematic-axis')
export class ThematicAxisController {
  constructor(
    private readonly createService: CreateThematicAxisService,
    private readonly findAllService: FindAllThematicAxisService,
    private readonly findOneService: FindOneThematicAxisService,
    private readonly updateService: UpdateThematicAxisService,
    private readonly deleteService: DeleteThematicAxisService,
  ) {}

  @Post()
  create(@Body() dto: CreateThematicAxisDto) {
    return this.createService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateThematicAxisDto) {
    return this.updateService.execute(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteService.execute(Number(id));
  }
}