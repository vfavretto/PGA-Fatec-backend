import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CreateThemeService } from './services/create-theme.service';
import { FindAllThemeService } from './services/find-all-theme.service';
import { FindOneThemeService } from './services/find-one-theme.service';
import { UpdateThemeService } from './services/update-theme.service';
import { DeleteThemeService } from './services/delete-theme.service';

@ApiTags('Configuration')
@ApiBearerAuth('JWT-auth')
@Controller('themes')
export class ThemesController {
  constructor(
    private readonly createService: CreateThemeService,
    private readonly findAllService: FindAllThemeService,
    private readonly findOneService: FindOneThemeService,
    private readonly updateService: UpdateThemeService,
    private readonly deleteService: DeleteThemeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar tema', description: 'Cria um novo tema no sistema' })
  @ApiBody({ type: CreateThemeDto })
  @ApiResponse({ status: 201, description: 'Tema criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateThemeDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar temas', description: 'Retorna lista de todos os temas' })
  @ApiResponse({ status: 200, description: 'Lista de temas retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tema por ID', description: 'Retorna dados de um tema específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do tema' })
  @ApiResponse({ status: 200, description: 'Tema encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tema não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar tema', description: 'Atualiza dados de um tema específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do tema' })
  @ApiBody({ type: UpdateThemeDto })
  @ApiResponse({ status: 200, description: 'Tema atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tema não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateThemeDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tema', description: 'Remove um tema do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do tema' })
  @ApiResponse({ status: 200, description: 'Tema excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Tema não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
