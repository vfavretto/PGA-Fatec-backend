import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateCpaActionDto } from './dto/create-cpa-action.dto';
import { UpdateCpaActionDto } from './dto/update-cpa-action.dto';
import { CreateCpaActionService } from './services/create-cpa-action.service';
import { FindAllCpaActionService } from './services/find-all-cpa-action.service';
import { FindOneCpaActionService } from './services/find-one-cpa-action.service';
import { UpdateCpaActionService } from './services/update-cpa-action.service';
import { DeleteCpaActionService } from './services/delete-cpa-action.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('cpa-action')
@UseGuards(JwtAuthGuard)
export class CpaActionController {
  constructor(
    private readonly createService: CreateCpaActionService,
    private readonly findAllService: FindAllCpaActionService,
    private readonly findOneService: FindOneCpaActionService,
    private readonly updateService: UpdateCpaActionService,
    private readonly deleteService: DeleteCpaActionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar ação CPA', description: 'Cria uma nova ação da Comissão Própria de Avaliação' })
  @ApiBody({ type: CreateCpaActionDto })
  @ApiResponse({ status: 201, description: 'Ação CPA criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateCpaActionDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ações CPA', description: 'Retorna lista de todas as ações CPA' })
  @ApiResponse({ status: 200, description: 'Lista de ações CPA retornada com sucesso' })
  findAll(@Request() req: any) {
    return this.findAllService.execute(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ação CPA por ID', description: 'Retorna dados de uma ação CPA específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ação CPA' })
  @ApiResponse({ status: 200, description: 'Ação CPA encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Ação CPA não encontrada' })
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar ação CPA', description: 'Atualiza dados de uma ação CPA específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ação CPA' })
  @ApiBody({ type: UpdateCpaActionDto })
  @ApiResponse({ status: 200, description: 'Ação CPA atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Ação CPA não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCpaActionDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir ação CPA', description: 'Remove uma ação CPA do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da ação CPA' })
  @ApiResponse({ status: 200, description: 'Ação CPA excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Ação CPA não encontrada' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
