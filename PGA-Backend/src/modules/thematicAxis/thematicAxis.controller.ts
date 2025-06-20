import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateThematicAxisDto } from './dto/create-thematicAxis.dto';
import { UpdateThematicAxisDto } from './dto/update-thematicAxis.dto';
import { CreateThematicAxisService } from './services/create-thematicAxis.service';
import { FindAllThematicAxisService } from './services/find-all-thematicAxis.service'
import { FindOneThematicAxisService } from './services/find-one-thematicAxis.service';
import { UpdateThematicAxisService } from './services/update-thematicAxis.service';
import { DeleteThematicAxisService } from './services/delete-thematicAxis.service';

@ApiTags('Configuration')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Criar eixo temático', description: 'Cria um novo eixo temático no sistema' })
  @ApiBody({ type: CreateThematicAxisDto })
  @ApiResponse({ status: 201, description: 'Eixo temático criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateThematicAxisDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eixos temáticos', description: 'Retorna lista de todos os eixos temáticos' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar eixo temático por ID', description: 'Retorna dados de um eixo temático específico' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do eixo temático' })
  @ApiResponse({ status: 200, description: 'Eixo temático encontrado' })
  @ApiResponse({ status: 404, description: 'Eixo temático não encontrado' })
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar eixo temático', description: 'Atualiza dados de um eixo temático específico' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do eixo temático' })
  @ApiBody({ type: UpdateThematicAxisDto })
  @ApiResponse({ status: 200, description: 'Eixo temático atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Eixo temático não encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateThematicAxisDto) {
    return this.updateService.execute(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir eixo temático', description: 'Remove um eixo temático do sistema' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do eixo temático' })
  @ApiResponse({ status: 200, description: 'Eixo temático excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Eixo temático não encontrado' })
  remove(@Param('id') id: string) {
    return this.deleteService.execute(Number(id));
  }
}