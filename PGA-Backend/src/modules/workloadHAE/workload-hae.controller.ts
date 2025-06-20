import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateWorkloadHaeService } from './services/create-workload-hae.service';
import { FindAllWorkloadHaeService } from './services/find-all-workload-hae.service';
import { FindOneWorkloadHaeService } from './services/find-one-workload-hae.service';
import { UpdateWorkloadHaeService } from './services/update-workload-hae.service';
import { DeleteWorkloadHaeService } from './services/delete-workload-hae.service';
import { CreateWorkloadHaeDto } from './dto/create-workload-hae.dto';
import { UpdateWorkloadHaeDto } from './dto/update-workload-hae.dto';

@ApiTags('Academic')
@ApiBearerAuth('JWT-auth')
@Controller('workload-hae')
export class WorkloadHaeController {
  constructor(
    private readonly createService: CreateWorkloadHaeService,
    private readonly findAllService: FindAllWorkloadHaeService,
    private readonly findOneService: FindOneWorkloadHaeService,
    private readonly updateService: UpdateWorkloadHaeService,
    private readonly deleteService: DeleteWorkloadHaeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar carga horária HAE', description: 'Cria uma nova carga horária de Hora Atividade Específica' })
  @ApiBody({ type: CreateWorkloadHaeDto })
  @ApiResponse({ status: 201, description: 'Carga horária HAE criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateWorkloadHaeDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cargas horárias HAE', description: 'Retorna lista de todas as cargas horárias HAE' })
  @ApiResponse({ status: 200, description: 'Lista de cargas horárias HAE retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar carga horária HAE por ID', description: 'Retorna dados de uma carga horária HAE específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da carga horária HAE' })
  @ApiResponse({ status: 200, description: 'Carga horária HAE encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Carga horária HAE não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar carga horária HAE', description: 'Atualiza dados de uma carga horária HAE específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da carga horária HAE' })
  @ApiBody({ type: UpdateWorkloadHaeDto })
  @ApiResponse({ status: 200, description: 'Carga horária HAE atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Carga horária HAE não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkloadHaeDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir carga horária HAE', description: 'Remove uma carga horária HAE do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da carga horária HAE' })
  @ApiResponse({ status: 200, description: 'Carga horária HAE excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Carga horária HAE não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
