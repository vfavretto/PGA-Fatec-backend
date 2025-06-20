import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseService } from './services/create-course.service';
import { FindAllCourseService } from './services/find-all-course.service';
import { FindOneCourseService } from './services/find-one-course.service';
import { UpdateCourseService } from './services/update-course.service';
import { DeleteCourseService } from './services/delete-course.service';

@ApiTags('Academic')
@ApiBearerAuth('JWT-auth')
@Controller('course')
export class CourseController {
  constructor(
    private readonly createService: CreateCourseService,
    private readonly findAllService: FindAllCourseService,
    private readonly findOneService: FindOneCourseService,
    private readonly updateService: UpdateCourseService,
    private readonly deleteService: DeleteCourseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar curso', description: 'Cria um novo curso no sistema' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreateCourseDto) {
    return this.createService.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cursos', description: 'Retorna lista de todos os cursos' })
  @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso' })
  findAll() {
    return this.findAllService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar curso por ID', description: 'Retorna dados de um curso específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar curso', description: 'Atualiza dados de um curso específico' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do curso' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.updateService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir curso', description: 'Remove um curso do sistema' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.execute(id);
  }
}
