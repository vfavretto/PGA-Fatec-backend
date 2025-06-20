import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('pga')
export class PgaController {
  constructor(
    private readonly createPgaService: CreatePgaService,
    private readonly findAllPgaService: FindAllPgaService,
    private readonly findOnePgaService: FindOnePgaService,
    private readonly updatePgaService: UpdatePgaService,
    private readonly deletePgaService: DeletePgaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo PGA', description: 'Cria um novo Plano de Gestão Acadêmica' })
  @ApiBody({ type: CreatePgaDto })
  @ApiResponse({ status: 201, description: 'PGA criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreatePgaDto) {
    return this.createPgaService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar PGAs', description: 'Retorna lista de todos os PGAs' })
  @ApiResponse({ status: 200, description: 'Lista de PGAs retornada com sucesso' })
  findAll() {
    return this.findAllPgaService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar PGA por ID', description: 'Retorna dados de um PGA específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOnePgaService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar PGA', description: 'Atualiza dados de um PGA específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiBody({ type: UpdatePgaDto })
  @ApiResponse({ status: 200, description: 'PGA atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePgaDto) {
    return this.updatePgaService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir PGA', description: 'Remove um PGA do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deletePgaService.execute(id);
  }
}