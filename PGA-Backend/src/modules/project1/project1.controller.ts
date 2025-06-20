import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { CreateProject1Service } from './services/createProject1.service';
import { DeleteProject1Service } from './services/deleteProject1.service';
import { FindAllProject1Service } from './services/findAllProject1.service';
import { FindOneProject1Service } from './services/findOneProject1.service';
import { UpdateProject1Service } from './services/updateProject1.service';
import { CreateProject1Dto } from './dto/create-project1.dto';
import { UpdateProject1Dto } from './dto/update-project1.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('project1')
export class Project1Controller {
  constructor(
    private readonly createProject1Service: CreateProject1Service,
    private readonly deleteProject1Service: DeleteProject1Service,
    private readonly findAllProject1Service: FindAllProject1Service,
    private readonly findOneProject1Service: FindOneProject1Service,
    private readonly updateProject1Service: UpdateProject1Service,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar projetos',
    description: 'Retorna lista de todos os projetos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos retornada com sucesso',
  })
  async findAll() {
    return this.findAllProject1Service.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar projeto por ID',
    description: 'Retorna dados de um projeto específico',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneProject1Service.execute(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo projeto',
    description: 'Cria um novo projeto no sistema',
  })
  @ApiBody({
    description: 'Dados do novo projeto',
    schema: {
      type: 'object',
      properties: {
        codigo_projeto: { type: 'string', description: 'Código do projeto' },
        nome_projeto: { type: 'string', description: 'Nome do projeto' },
        pga_id: { type: 'number', description: 'ID do PGA' },
        eixo_id: { type: 'number', description: 'ID do eixo temático' },
        prioridade_id: { type: 'number', description: 'ID da prioridade' },
        tema_id: { type: 'number', description: 'ID do tema' },
        o_que_sera_feito: {
          type: 'string',
          description: 'Descrição do que será feito',
        },
        por_que_sera_feito: {
          type: 'string',
          description: 'Justificativa do projeto',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() data: CreateProject1Dto) {
    return this.createProject1Service.execute(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar projeto',
    description: 'Atualiza dados de um projeto específico',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do projeto' })
  @ApiBody({ description: 'Dados a serem atualizados' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProject1Dto,
  ) {
    return this.updateProject1Service.execute(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir projeto',
    description: 'Remove um projeto do sistema',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do projeto' })
  @ApiResponse({ status: 200, description: 'Projeto excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteProject1Service.execute(id);
  }
}
