import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateProblemSituationService } from './services/create-problemSituation.service';
import { FindAllProblemSituationService } from './services/find-all-problemSituation.service';
import { FindOneProblemSituationService } from './services/find-one-problemSituation.service';
import { UpdateProblemSituationService } from './services/update-problemSituation.service';
import { DeleteProblemSituationService } from './services/delete-problemSituation.service';
import { CreateProblemSituationDto } from './dto/create-problemSituation.dto';
import { UpdateProblemSituationDto } from './dto/update-problemSituation.dto';

@ApiTags('Configuration')
@ApiBearerAuth('JWT-auth')
@Controller('problem-situation')
export class ProblemSituationController {
  constructor(
    private readonly createService: CreateProblemSituationService,
    private readonly findAllService: FindAllProblemSituationService,
    private readonly findOneService: FindOneProblemSituationService,
    private readonly updateService: UpdateProblemSituationService,
    private readonly deleteService: DeleteProblemSituationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar situação problema', description: 'Cria uma nova situação problema no sistema' })
  @ApiBody({ type: CreateProblemSituationDto })
  @ApiResponse({ status: 201, description: 'Situação problema criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateProblemSituationDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar situações problema', description: 'Retorna lista de todas as situações problema' })
  @ApiResponse({ status: 200, description: 'Lista de situações problema retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar situação problema por ID', description: 'Retorna dados de uma situação problema específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da situação problema' })
  @ApiResponse({ status: 200, description: 'Situação problema encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Situação problema não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar situação problema', description: 'Atualiza dados de uma situação problema específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da situação problema' })
  @ApiBody({ type: UpdateProblemSituationDto })
  @ApiResponse({ status: 200, description: 'Situação problema atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Situação problema não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemSituationDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir situação problema', description: 'Remove uma situação problema do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da situação problema' })
  @ApiResponse({ status: 200, description: 'Situação problema excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Situação problema não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
