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
  Post,
  ForbiddenException,
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
import { ListRegionaisService } from './services/list-regionais.service';
import { RegionalRepository } from './regional.repository';
import { FindRegionalByResponsavelService } from './services/find-regional-by-responsavel.service';
import { GetRegionalPgaService } from './services/get-regional-pga.service';
import { GetRegionalService } from './services/get-regional.service';
import { ReviewRegionalPgaService } from './services/review-regional-pga.service';
import { ListRegionalProjectsService } from './services/list-regional-projects.service';
import { GetRegionalProjectService } from './services/get-regional-project.service';
import { ReviewRegionalProjectService } from './services/review-regional-project.service';
import { RegionalPgaQueryDto } from './dto/regional-pga-query.dto';
import { ReviewPgaDto } from './dto/review-pga.dto';
import { RegionalProjectQueryDto } from './dto/regional-project-query.dto';
import { ReviewProjectDto } from './dto/review-project.dto';
import { CreateRegionalService } from './services/create-regional.service';
import { CreateRegionalDto } from './dto/create-regional.dto';

@ApiTags('Regional')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles('Regional', 'Administrador', 'CPS')
@Controller('regional')
export class RegionalController {
  constructor(
    private readonly listRegionalUnitsService: ListRegionalUnitsService,
    private readonly listRegionaisService: ListRegionaisService,
    private readonly regionalRepository: RegionalRepository,
    private readonly findRegionalByResponsavelService: FindRegionalByResponsavelService,
    private readonly listRegionalPgasService: ListRegionalPgasService,
    private readonly getRegionalPgaService: GetRegionalPgaService,
    private readonly getRegionalService: GetRegionalService,
    private readonly reviewRegionalPgaService: ReviewRegionalPgaService,
    private readonly listRegionalProjectsService: ListRegionalProjectsService,
    private readonly getRegionalProjectService: GetRegionalProjectService,
    private readonly reviewRegionalProjectService: ReviewRegionalProjectService,
    private readonly createRegionalService: CreateRegionalService,
  ) {}

  @Post()
  @Roles('Administrador')
  @ApiOperation({
    summary: 'Criar regional',
    description: 'Cria uma nova regional',
  })
  @ApiBody({ type: CreateRegionalDto })
  @ApiResponse({ status: 201, description: 'Regional criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() dto: CreateRegionalDto) {
    return this.createRegionalService.execute(dto);
  }

  @Get()
  @Roles('Administrador', 'CPS')
  @ApiOperation({
    summary: 'Listar regionais',
    description: 'Retorna todas as regionais ativas do sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de regionais retornada com sucesso.',
  })
  async listRegionais() {
    return this.listRegionaisService.execute();
  }

  @Get('unidades')
  @ApiOperation({
    summary: 'Listar unidades (todas ou por regional)',
    description:
      'Se o query param `regional_id` for informado retorna unidades da regional. Caso contrário retorna todas as regionais com suas unidades.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades retornada com sucesso.',
  })
  async listUnits(@Request() req, @Query('regional_id') regionalId?: string) {
    const userRole = req.user?.tipo_usuario;

    if (regionalId) {
      const rid = Number(regionalId);
      if (userRole === 'Administrador' || userRole === 'CPS') {
        return this.listRegionalUnitsService.execute(rid);
      }

      if (userRole === 'Regional') {
        const active = req.user.active_context;
        let userRegionalId: number | null = null;
        if (active && active.tipo === 'regional') {
          userRegionalId = Number(active.id);
        } else {
          const regional = await this.findRegionalByResponsavelService.execute(
            req.user.pessoa_id,
          );
          userRegionalId = regional ? regional.regional_id : null;
        }

        if (userRegionalId && userRegionalId === rid) {
          return this.listRegionalUnitsService.execute(rid);
        }

        throw new ForbiddenException();
      }

      throw new ForbiddenException();
    }

    if (userRole === 'Administrador' || userRole === 'CPS') {
      const regionais = await this.listRegionaisService.execute();
      const results = await Promise.all(
        regionais.map(async (r: any) => {
          const unidades = await this.listRegionalUnitsService.execute(
            Number(r.regional_id),
          );
          return {
            ...r,
            unidades,
          };
        }),
      );
      return results;
    }

    if (userRole === 'Regional') {
      const active = req.user.active_context;
      let userRegionalId: number | null = null;
      if (active && active.tipo === 'regional') {
        userRegionalId = Number(active.id);
      } else {
        const regional = await this.findRegionalByResponsavelService.execute(
          req.user.pessoa_id,
        );
        userRegionalId = regional ? regional.regional_id : null;
      }

      if (!userRegionalId) return [];

      const regional = await this.getRegionalService.execute(userRegionalId);
      const unidades =
        await this.listRegionalUnitsService.execute(userRegionalId);
      return { ...regional, unidades };
    }

    throw new ForbiddenException();
  }

  @Get('unidades/:id')
  @ApiOperation({
    summary: 'Listar unidades de uma regional específica',
    description: 'Retorna as unidades da regional informada pelo id.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da regional',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades retornada com sucesso.',
  })
  async listUnitsById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userRole = req.user?.tipo_usuario;
    if (userRole === 'Administrador' || userRole === 'CPS') {
      return this.listRegionalUnitsService.execute(id);
    }

    if (userRole === 'Regional') {
      const active = req.user.active_context;
      let userRegionalId: number | null = null;
      if (active && active.tipo === 'regional') {
        userRegionalId = Number(active.id);
      } else {
        const regional = await this.findRegionalByResponsavelService.execute(
          req.user.pessoa_id,
        );
        userRegionalId = regional ? regional.regional_id : null;
      }

      if (userRegionalId && userRegionalId === id) {
        return this.listRegionalUnitsService.execute(id);
      }

      throw new ForbiddenException();
    }

    throw new ForbiddenException();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter regional por id',
    description: 'Retorna os dados de uma regional especificada pelo id.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador da regional',
  })
  @ApiResponse({ status: 200, description: 'Regional retornada com sucesso.' })
  async getRegional(@Param('id', ParseIntPipe) id: number) {
    return this.getRegionalService.execute(id);
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
    const active = req.user.active_context;

    if (active && active.tipo === 'unidade') {
      query.unidadeId = Number(active.id);
      return this.listRegionalPgasService.execute(req.user.pessoa_id, query);
    }

    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.listRegionalPgasService.execute(regionalId, query);
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
  async getPga(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const active = req.user.active_context;
    if (active && active.tipo === 'unidade') {
      return this.getRegionalPgaService.execute(req.user.pessoa_id, id);
    }

    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.getRegionalPgaService.execute(regionalId, id);
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
    const active = req.user.active_context;
    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.reviewRegionalPgaService.execute(regionalId, id, body);
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
  async listProjects(@Request() req, @Query() query: RegionalProjectQueryDto) {
    const active = req.user.active_context;
    if (active && active.tipo === 'unidade') {
      query.unidadeId = Number(active.id);
      return this.listRegionalProjectsService.execute(
        req.user.pessoa_id,
        query,
      );
    }

    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.listRegionalProjectsService.execute(regionalId, query);
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
  async getProject(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const active = req.user.active_context;
    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.getRegionalProjectService.execute(regionalId, id);
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
    const active = req.user.active_context;
    const regionalId =
      active && active.tipo === 'regional'
        ? Number(active.id)
        : req.user.pessoa_id;
    return this.reviewRegionalProjectService.execute(regionalId, id, body);
  }
}
