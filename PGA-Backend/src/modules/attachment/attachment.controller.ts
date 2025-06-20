import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { CreateAttachmentService } from './services/create-attachment.service';
import { FindAllAttachmentService } from './services/find-all-attachment.service';
import { FindOneAttachmentService } from './services/find-one-attachment.service';
import { UpdateAttachmentService } from './services/update-attachment.service';
import { DeleteAttachmentService } from './services/delete-attachment.service';
import { FindByProcessStepService } from './services/find-by-process-step.service';
import { FindByDeliverableService } from './services/find-by-deliverable.service';
import { Public } from '../auth/decorators/is-public.decorator';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('attachments')
export class AttachmentController {
  constructor(
    private readonly createService: CreateAttachmentService,
    private readonly findAllService: FindAllAttachmentService,
    private readonly findOneService: FindOneAttachmentService,
    private readonly updateService: UpdateAttachmentService,
    private readonly deleteService: DeleteAttachmentService,
    private readonly findByEtapaProcessoService: FindByProcessStepService,
    private readonly findByEntregavelService: FindByDeliverableService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar anexo', description: 'Cria um novo anexo no sistema' })
  @ApiBody({ type: CreateAttachmentDto })
  @ApiResponse({ status: 201, description: 'Anexo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateAttachmentDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar anexos', description: 'Retorna lista de todos os anexos' })
  @ApiResponse({ status: 200, description: 'Lista de anexos retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get('etapa-processo/:id')
  @ApiOperation({ summary: 'Buscar anexos por etapa de processo', description: 'Retorna anexos de uma etapa específica' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da etapa do processo' })
  @ApiResponse({ status: 200, description: 'Anexos encontrados com sucesso' })
  findByEtapaProcesso(@Param('id', ParseIntPipe) id: number) {
    return this.findByEtapaProcessoService.execute(id);
  }

  @Get('entregavel/:id')
  @ApiOperation({ summary: 'Buscar anexos por entregável', description: 'Retorna anexos de um entregável específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do entregável' })
  @ApiResponse({ status: 200, description: 'Anexos encontrados com sucesso' })
  findByEntregavel(@Param('id', ParseIntPipe) id: number) {
    return this.findByEntregavelService.execute(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar anexo por ID', description: 'Retorna dados de um anexo específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do anexo' })
  @ApiResponse({ status: 200, description: 'Anexo encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Anexo não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar anexo', description: 'Atualiza dados de um anexo específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do anexo' })
  @ApiBody({ type: UpdateAttachmentDto })
  @ApiResponse({ status: 200, description: 'Anexo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Anexo não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAttachmentDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir anexo', description: 'Remove um anexo do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do anexo' })
  @ApiResponse({ status: 200, description: 'Anexo excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Anexo não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
