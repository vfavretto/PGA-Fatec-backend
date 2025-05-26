import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CreateThemeService } from './services/create-theme.service';
import { FindAllThemeService } from './services/find-all-theme.service';
import { FindOneThemeService } from './services/find-one-theme.service';
import { UpdateThemeService } from './services/update-theme.service';
import { DeleteThemeService } from './services/delete-theme.service';

@Controller('themes')
export class ThemesController {
  constructor(
    private readonly createService: CreateThemeService,
    private readonly findAllService: FindAllThemeService,
    private readonly findOneService: FindOneThemeService,
    private readonly updateService: UpdateThemeService,
    private readonly deleteService: DeleteThemeService,
  ) {}

  @Post()
  create(@Body() dto: CreateThemeDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateThemeDto) {
    return this.updateService.execute(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteService.execute(Number(id));
  }
}
