import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateRoutineOccurrenceDto } from './dto/create-routine-occurrence.dto';
import { UpdateRoutineOccurrenceDto } from './dto/update-routine-occurrence.dto';
import { CreateRoutineOccurrenceService } from './services/create-routine-occurrence.service';
import { FindAllRoutineOccurrenceService } from './services/find-all-routine-occurrence.service';
import { FindOneRoutineOccurrenceService } from './services/find-one-routine-occurrence.service';
import { UpdateRoutineOccurrenceService } from './services/update-routine-occurrence.service';
import { DeleteRoutineOccurrenceService } from './services/delete-routine-occurrence.service';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('routine-occurrence')
export class RoutineOccurrenceController {
  constructor(
    private readonly createService: CreateRoutineOccurrenceService,
    private readonly findAllService: FindAllRoutineOccurrenceService,
    private readonly findOneService: FindOneRoutineOccurrenceService,
    private readonly updateService: UpdateRoutineOccurrenceService,
    private readonly deleteService: DeleteRoutineOccurrenceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar ocorrência de rotina', description: 'Cria uma nova ocorrência de rotina institucional' })
  @ApiBody({ type: CreateRoutineOccurrenceDto })
  @ApiResponse({ status: 201, description: 'Ocorrência de rotina criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateRoutineOccurrenceDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ocorrências de rotina', description: 'Retorna lista de todas as ocorrências de rotina' })
  @ApiResponse({ status: 200, description: 'Lista de ocorrências de rotina retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ocorrência de rotina por ID', description: 'Retorna dados de uma ocorrência de rotina específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ocorrência de rotina' })
  @ApiResponse({ status: 200, description: 'Ocorrência de rotina encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Ocorrência de rotina não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar ocorrência de rotina', description: 'Atualiza dados de uma ocorrência de rotina específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ocorrência de rotina' })
  @ApiBody({ type: UpdateRoutineOccurrenceDto })
  @ApiResponse({ status: 200, description: 'Ocorrência de rotina atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Ocorrência de rotina não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoutineOccurrenceDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir ocorrência de rotina', description: 'Remove uma ocorrência de rotina do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ocorrência de rotina' })
  @ApiResponse({ status: 200, description: 'Ocorrência de rotina excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Ocorrência de rotina não encontrada' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
