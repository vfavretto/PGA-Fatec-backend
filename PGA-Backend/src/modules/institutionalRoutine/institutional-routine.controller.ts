import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateInstitutionalRoutineDto } from './dto/create-institutional-routine.dto';
import { UpdateInstitutionalRoutineDto } from './dto/update-institutional-routine.dto';
import { CreateInstitutionalRoutineService } from './services/create-institutional-routine.service';
import { FindAllInstitutionalRoutineService } from './services/find-all-institutional-routine.service';
import { FindOneInstitutionalRoutineService } from './services/find-one-institutional-routine.service';
import { UpdateInstitutionalRoutineService } from './services/update-institutional-routine.service';
import { DeleteInstitutionalRoutineService } from './services/delete-institutional-routine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('institutional-routine')
@UseGuards(JwtAuthGuard)
export class InstitutionalRoutineController {
  constructor(
    private readonly createService: CreateInstitutionalRoutineService,
    private readonly findAllService: FindAllInstitutionalRoutineService,
    private readonly findOneService: FindOneInstitutionalRoutineService,
    private readonly updateService: UpdateInstitutionalRoutineService,
    private readonly deleteService: DeleteInstitutionalRoutineService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar rotina institucional', description: 'Cria uma nova rotina institucional no sistema' })
  @ApiBody({ type: CreateInstitutionalRoutineDto })
  @ApiResponse({ status: 201, description: 'Rotina institucional criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateInstitutionalRoutineDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar rotinas institucionais', description: 'Retorna lista de todas as rotinas institucionais' })
  @ApiResponse({ status: 200, description: 'Lista de rotinas institucionais retornada com sucesso' })
  findAll(@Request() req: any) {
    return this.findAllService.execute(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar rotina institucional por ID', description: 'Retorna dados de uma rotina institucional específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da rotina institucional' })
  @ApiResponse({ status: 200, description: 'Rotina institucional encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Rotina institucional não encontrada' })
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar rotina institucional', description: 'Atualiza dados de uma rotina institucional específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da rotina institucional' })
  @ApiBody({ type: UpdateInstitutionalRoutineDto })
  @ApiResponse({ status: 200, description: 'Rotina institucional atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Rotina institucional não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInstitutionalRoutineDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir rotina institucional', description: 'Remove uma rotina institucional do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da rotina institucional' })
  @ApiResponse({ status: 200, description: 'Rotina institucional excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Rotina institucional não encontrada' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
