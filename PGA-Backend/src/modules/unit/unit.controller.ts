import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { CreateUnitService } from './services/create-unit.service';
import { FindAllUnitsService } from './services/find-all-units.service';
import { FindOneUnitService } from './services/find-one-unit.service';
import { UpdateUnitService } from './services/update-unit.service';
import { DeleteUnitService } from './services/delete-unit.service';

@ApiTags('Academic')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Criar unidade', description: 'Cria uma nova unidade no sistema' })
  @ApiBody({ type: CreateUnitDto })
  @ApiResponse({ status: 201, description: 'Unidade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateUnitDto) {
    return this.createUnitService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar unidades', description: 'Retorna lista de todas as unidades' })
  @ApiResponse({ status: 200, description: 'Lista de unidades retornada com sucesso' })
  findAll() {
    return this.findAllUnitsService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar unidade por ID', description: 'Retorna dados de uma unidade específica' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da unidade' })
  @ApiResponse({ status: 200, description: 'Unidade encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  findOne(@Param('id') id: string) {
    return this.findOneUnitService.execute(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar unidade', description: 'Atualiza dados de uma unidade específica' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da unidade' })
  @ApiBody({ type: UpdateUnitDto })
  @ApiResponse({ status: 200, description: 'Unidade atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.updateUnitService.execute(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir unidade', description: 'Remove uma unidade do sistema' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da unidade' })
  @ApiResponse({ status: 200, description: 'Unidade excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  remove(@Param('id') id: string) {
    return this.deleteUnitService.execute(Number(id));
  }
}