import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateDeliverableService } from './services/create-deliverable.service';
import { FindAllDeliverableService } from './services/find-all-deliverable.service';
import { FindOneDeliverableService } from './services/find-one-deliverable.service';
import { UpdateDeliverableService } from './services/update-deliverable.service';
import { DeleteDeliverableService } from './services/delete-deliverable.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('deliverable')
export class DeliverableController {
  constructor(
    private readonly createService: CreateDeliverableService,
    private readonly findAllService: FindAllDeliverableService,
    private readonly findOneService: FindOneDeliverableService,
    private readonly updateService: UpdateDeliverableService,
    private readonly deleteService: DeleteDeliverableService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar entregável', description: 'Cria um novo entregável no sistema' })
  @ApiBody({ type: CreateDeliverableDto })
  @ApiResponse({ status: 201, description: 'Entregável criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateDeliverableDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar entregáveis', description: 'Retorna lista de todos os entregáveis' })
  @ApiResponse({ status: 200, description: 'Lista de entregáveis retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar entregável por ID', description: 'Retorna dados de um entregável específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do entregável' })
  @ApiResponse({ status: 200, description: 'Entregável encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Entregável não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar entregável', description: 'Atualiza dados de um entregável específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do entregável' })
  @ApiBody({ type: UpdateDeliverableDto })
  @ApiResponse({ status: 200, description: 'Entregável atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Entregável não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeliverableDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir entregável', description: 'Remove um entregável do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do entregável' })
  @ApiResponse({ status: 200, description: 'Entregável excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Entregável não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}