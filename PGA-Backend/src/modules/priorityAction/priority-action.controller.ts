import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePriorityActionService } from './services/create-priority-action.service';
import { FindAllPriorityActionService } from './services/find-all-priority-action.service';
import { FindOnePriorityActionService } from './services/find-one-priority-action.service';
import { UpdatePriorityActionService } from './services/update-priority-action.service';
import { DeletePriorityActionService } from './services/delete-priority-action.service';
import { CreatePriorityActionDto } from './dto/create-priority-action.dto';
import { UpdatePriorityActionDto } from './dto/update-priority-action.dto';

@ApiTags('Configuration')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Criar prioridade de ação', description: 'Cria uma nova prioridade de ação no sistema' })
  @ApiBody({ type: CreatePriorityActionDto })
  @ApiResponse({ status: 201, description: 'Prioridade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreatePriorityActionDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar prioridades', description: 'Retorna lista de todas as prioridades de ação' })
  @ApiResponse({ status: 200, description: 'Lista de prioridades retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar prioridade por ID', description: 'Retorna dados de uma prioridade específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da prioridade' })
  @ApiResponse({ status: 200, description: 'Prioridade encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prioridade não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar prioridade', description: 'Atualiza dados de uma prioridade específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da prioridade' })
  @ApiBody({ type: UpdatePriorityActionDto })
  @ApiResponse({ status: 200, description: 'Prioridade atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prioridade não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePriorityActionDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir prioridade', description: 'Remove uma prioridade do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da prioridade' })
  @ApiResponse({ status: 200, description: 'Prioridade excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Prioridade não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}