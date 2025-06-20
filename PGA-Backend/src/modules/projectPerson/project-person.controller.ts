import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateProjectPersonDto } from './dto/create-project-person.dto';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto';
import { CreateProjectPersonService } from './services/create-project-person.service';
import { FindAllProjectPersonService } from './services/find-all-project-person.service';
import { FindOneProjectPersonService } from './services/find-one-project-person.service';
import { UpdateProjectPersonService } from './services/update-project-person.service';
import { DeleteProjectPersonService } from './services/delete-project-person.service';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('project-person')
export class ProjectPersonController {
  constructor(
    private readonly createService: CreateProjectPersonService,
    private readonly findAllService: FindAllProjectPersonService,
    private readonly findOneService: FindOneProjectPersonService,
    private readonly updateService: UpdateProjectPersonService,
    private readonly deleteService: DeleteProjectPersonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Vincular pessoa ao projeto', description: 'Cria um novo vínculo entre pessoa e projeto' })
  @ApiBody({ type: CreateProjectPersonDto })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateProjectPersonDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vínculos projeto-pessoa', description: 'Retorna lista de todos os vínculos entre projetos e pessoas' })
  @ApiResponse({ status: 200, description: 'Lista de vínculos retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vínculo por ID', description: 'Retorna dados de um vínculo específico entre projeto e pessoa' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do vínculo projeto-pessoa' })
  @ApiResponse({ status: 200, description: 'Vínculo encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar vínculo projeto-pessoa', description: 'Atualiza dados de um vínculo específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do vínculo projeto-pessoa' })
  @ApiBody({ type: UpdateProjectPersonDto })
  @ApiResponse({ status: 200, description: 'Vínculo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectPersonDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover vínculo projeto-pessoa', description: 'Remove um vínculo entre projeto e pessoa' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do vínculo projeto-pessoa' })
  @ApiResponse({ status: 200, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
