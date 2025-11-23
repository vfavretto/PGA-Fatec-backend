import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ListRegionalUnitsService } from './services/list-regional-units.service';
import { ListRegionalPgasService } from './services/list-regional-pgas.service';
import { GetRegionalPgaService } from './services/get-regional-pga.service';
import { ReviewRegionalPgaService } from './services/review-regional-pga.service';
import { ListRegionalProjectsService } from './services/list-regional-projects.service';
import { GetRegionalProjectService } from './services/get-regional-project.service';
import { ReviewRegionalProjectService } from './services/review-regional-project.service';
import { RegionalPgaQueryDto } from './dto/regional-pga-query.dto';
import { ReviewPgaDto } from './dto/review-pga.dto';
import { RegionalProjectQueryDto } from './dto/regional-project-query.dto';
import { ReviewProjectDto } from './dto/review-project.dto';

@ApiTags('Regional')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles('Regional', 'Administrador', 'CPS')
@Controller('regional')
export class RegionalController {
  constructor(
    private readonly listRegionalUnitsService: ListRegionalUnitsService,
    private readonly listRegionalPgasService: ListRegionalPgasService,
    private readonly getRegionalPgaService: GetRegionalPgaService,
    private readonly reviewRegionalPgaService: ReviewRegionalPgaService,
    private readonly listRegionalProjectsService: ListRegionalProjectsService,
    private readonly getRegionalProjectService: GetRegionalProjectService,
    private readonly reviewRegionalProjectService: ReviewRegionalProjectService,
  ) {}

  @Get('unidades')
  @ApiOperation({
    summary: 'Listar unidades sob responsabilidade regional',
    description:
      'Retorna as unidades vinculadas ao usuário com perfil Regional.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades retornada com sucesso.',
  })
  async listUnits(@Request() req) {
    return this.listRegionalUnitsService.execute(req.user.pessoa_id);
  }

  @Get('pgas')
  @ApiOperation({
    summary: 'Listar PGAs das unidades sob responsabilidade',
    description:
      'Retorna PGAs das unidades vinculadas ao usuário regional com filtros opcionais.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de PGAs retornada com sucesso.',
  })
  async listPgas(@Request() req, @Query() query: RegionalPgaQueryDto) {
    return this.listRegionalPgasService.execute(req.user.pessoa_id, query);
  }

  @Get('pgas/:id')
  @ApiOperation({
    summary: 'Obter detalhes de um PGA',
    description:
      'Retorna os detalhes de um PGA vinculado às unidades sob responsabilidade regional.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do PGA',
  })
  @ApiResponse({
    status: 200,
    description: 'PGA retornado com sucesso.',
  })
  async getPga(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.getRegionalPgaService.execute(req.user.pessoa_id, id);
  }

  @Patch('pgas/:id/avaliacao')
  @ApiOperation({
    summary: 'Aprovar ou reprovar um PGA',
    description:
      'Permite que a regional registre o parecer aprovando ou reprovando um PGA.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do PGA a ser avaliado',
  })
  @ApiBody({ type: ReviewPgaDto })
  @ApiResponse({
    status: 200,
    description: 'Parecer registrado com sucesso.',
  })
  async reviewPga(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReviewPgaDto,
  ) {
    return this.reviewRegionalPgaService.execute(
      req.user.pessoa_id,
      id,
      body,
    );
  }

  @Get('projetos')
  @ApiOperation({
    summary: 'Listar projetos das unidades sob responsabilidade',
    description:
      'Retorna projetos vinculados aos PGAs das unidades sob responsabilidade regional.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos retornada com sucesso.',
  })
  async listProjects(
    @Request() req,
    @Query() query: RegionalProjectQueryDto,
  ) {
    return this.listRegionalProjectsService.execute(
      req.user.pessoa_id,
      query,
    );
  }

  @Get('projetos/:id')
  @ApiOperation({
    summary: 'Obter detalhes de um projeto',
    description:
      'Retorna os detalhes de um projeto vinculado às unidades sob responsabilidade regional.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do projeto',
  })
  @ApiResponse({
    status: 200,
    description: 'Projeto retornado com sucesso.',
  })
  async getProject(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.getRegionalProjectService.execute(
      req.user.pessoa_id,
      id,
    );
  }

  @Patch('projetos/:id/avaliacao')
  @ApiOperation({
    summary: 'Aprovar ou reprovar um projeto',
    description:
      'Permite que a regional registre o parecer aprovando ou reprovando um projeto.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador do projeto a ser avaliado',
  })
  @ApiBody({ type: ReviewProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Parecer do projeto registrado com sucesso.',
  })
  async reviewProject(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReviewProjectDto,
  ) {
    return this.reviewRegionalProjectService.execute(
      req.user.pessoa_id,
      id,
      body,
    );
  }
}
