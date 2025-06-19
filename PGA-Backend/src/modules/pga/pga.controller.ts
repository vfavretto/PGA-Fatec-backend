import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';

@Controller('pga')
export class PgaController {
  constructor(
    private readonly createPgaService: CreatePgaService,
    private readonly findAllPgaService: FindAllPgaService,
    private readonly findOnePgaService: FindOnePgaService,
    private readonly updatePgaService: UpdatePgaService,
    private readonly deletePgaService: DeletePgaService,
  ) {}

  @Post()
  create(@Body() dto: CreatePgaDto) {
    return this.createPgaService.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllPgaService.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOnePgaService.execute(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePgaDto) {
    return this.updatePgaService.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deletePgaService.execute(id);
  }
}