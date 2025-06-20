import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateRoutineParticipantDto } from './dto/create-routine-participant.dto';
import { UpdateRoutineParticipantDto } from './dto/update-routine-participant.dto';
import { CreateRoutineParticipantService } from './services/create-routine-participant.service';
import { FindAllRoutineParticipantService } from './services/find-all-routine-participant.service';
import { FindOneRoutineParticipantService } from './services/find-one-routine-participant.service';
import { UpdateRoutineParticipantService } from './services/update-routine-participant.service';
import { DeleteRoutineParticipantService } from './services/delete-routine-participant.service';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('routine-participant')
export class RoutineParticipantController {
  constructor(
    private readonly createService: CreateRoutineParticipantService,
    private readonly findAllService: FindAllRoutineParticipantService,
    private readonly findOneService: FindOneRoutineParticipantService,
    private readonly updateService: UpdateRoutineParticipantService,
    private readonly deleteService: DeleteRoutineParticipantService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar participante à rotina', description: 'Adiciona um participante a uma rotina institucional' })
  @ApiBody({ type: CreateRoutineParticipantDto })
  @ApiResponse({ status: 201, description: 'Participante adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateRoutineParticipantDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar participantes de rotinas', description: 'Retorna lista de todos os participantes de rotinas' })
  @ApiResponse({ status: 200, description: 'Lista de participantes retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar participante por ID', description: 'Retorna dados de um participante específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do participante' })
  @ApiResponse({ status: 200, description: 'Participante encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar participante', description: 'Atualiza dados de um participante específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do participante' })
  @ApiBody({ type: UpdateRoutineParticipantDto })
  @ApiResponse({ status: 200, description: 'Participante atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoutineParticipantDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover participante', description: 'Remove um participante de uma rotina' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do participante' })
  @ApiResponse({ status: 200, description: 'Participante removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}