import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateProcessStepDto } from './dto/create-process-step.dto';
import { UpdateProcessStepDto } from './dto/update-process-step.dto';
import { CreateProcessStepService } from './services/create-process-step.service';
import { FindAllProcessStepService } from './services/find-all-process-step.service';
import { FindOneProcessStepService } from './services/find-one-process-step.service';
import { UpdateProcessStepService } from './services/update-process-step.service';
import { DeleteProcessStepService } from './services/delete-process-step.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('process-step')
@UseGuards(JwtAuthGuard)
export class ProcessStepController {
  constructor(
    private readonly createService: CreateProcessStepService,
    private readonly findAllService: FindAllProcessStepService,
    private readonly findOneService: FindOneProcessStepService,
    private readonly updateService: UpdateProcessStepService,
    private readonly deleteService: DeleteProcessStepService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar etapa de processo', description: 'Cria uma nova etapa de processo no sistema' })
  @ApiBody({ type: CreateProcessStepDto })
  @ApiResponse({ status: 201, description: 'Etapa de processo criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateProcessStepDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar etapas de processo', description: 'Retorna lista de todas as etapas de processo' })
  @ApiResponse({ status: 200, description: 'Lista de etapas de processo retornada com sucesso' })
  findAll(@Request() req: any) {
    return this.findAllService.execute(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar etapa de processo por ID', description: 'Retorna dados de uma etapa de processo específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da etapa de processo' })
  @ApiResponse({ status: 200, description: 'Etapa de processo encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Etapa de processo não encontrada' })
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar etapa de processo', description: 'Atualiza dados de uma etapa de processo específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da etapa de processo' })
  @ApiBody({ type: UpdateProcessStepDto })
  @ApiResponse({ status: 200, description: 'Etapa de processo atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Etapa de processo não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProcessStepDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir etapa de processo', description: 'Remove uma etapa de processo do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da etapa de processo' })
  @ApiResponse({ status: 200, description: 'Etapa de processo excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Etapa de processo não encontrada' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
