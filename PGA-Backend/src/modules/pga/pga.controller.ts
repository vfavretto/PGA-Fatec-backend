import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';
import { SubmitPgaService } from './services/submit-pga.service';
import { PublishPgaService } from './services/publish-pga.service';
import { ReviewPgaRegionalService } from './services/review-pga-regional.service';
import { ReviewPgaCpsService } from './services/review-pga-cps.service';
import { ExportPgaCsvService } from './services/export-pga-csv.service';
import { ExportPgaPdfService } from './services/export-pga-pdf.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('PGA')
@ApiBearerAuth('JWT-auth')
@Controller('pga')
@UseGuards(JwtAuthGuard)
export class PgaController {
  constructor(
    private readonly createPgaService: CreatePgaService,
    private readonly findAllPgaService: FindAllPgaService,
    private readonly findOnePgaService: FindOnePgaService,
    private readonly updatePgaService: UpdatePgaService,
    private readonly deletePgaService: DeletePgaService,
    private readonly submitPgaService: SubmitPgaService,
    private readonly publishPgaService: PublishPgaService,
    private readonly reviewPgaRegionalService: ReviewPgaRegionalService,
    private readonly reviewPgaCpsService: ReviewPgaCpsService,
    private readonly exportPgaCsvService: ExportPgaCsvService,
    private readonly exportPgaPdfService: ExportPgaPdfService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS')
  @ApiOperation({ summary: 'Criar PGA template (Admin/CPS)' })
  @ApiBody({ type: CreatePgaDto })
  @ApiResponse({ status: 201, description: 'PGA criado com sucesso' })
  create(@Body() dto: CreatePgaDto, @Request() req: any) {
    return this.createPgaService.execute(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar PGAs' })
  @ApiResponse({
    status: 200,
    description: 'Lista de PGAs retornada com sucesso',
  })
  findAll(@Request() req: any) {
    return this.findAllPgaService.execute(req.user);
  }

  @Get(':id/export/csv')
  @ApiOperation({ summary: 'Exportar PGA como CSV' })
  async exportCsv(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const csv = await this.exportPgaCsvService.execute(id, req.user);
    const filename = `pga-${id}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get(':id/export/pdf')
  @ApiOperation({ summary: 'Exportar PGA como PDF' })
  async exportPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.exportPgaPdfService.execute(id, req.user);
    const filename = `pga-${id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar PGA por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  findOne(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.findOnePgaService.execute(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar PGA (Diretor da unidade ou Admin/CPS)' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiBody({ type: UpdatePgaDto })
  @ApiResponse({ status: 200, description: 'PGA atualizado com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para editar este PGA',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePgaDto,
    @Request() req: any,
  ) {
    return this.updatePgaService.execute(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS')
  @ApiOperation({ summary: 'Excluir PGA (Admin/CPS)' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA excluído com sucesso' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deletePgaService.execute(id);
  }

  // ─── Fluxo de submissão e aprovação ──────────────────────────────────────

  @Post(':id/submeter')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS', 'Diretor')
  @ApiOperation({
    summary: 'Submeter PGA para análise regional',
    description:
      'Diretor submete o PGA da própria unidade. Administrador e CPS podem submeter qualquer PGA.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA submetido com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  submit(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.submitPgaService.execute(id, req.user.pessoa_id);
  }

  @Post(':id/publicar')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS')
  @ApiOperation({
    summary: 'Publicar PGA template para todas as unidades ativas',
    description:
      'Gera uma cópia do PGA template para cada unidade ativa. Operação irreversível.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA template' })
  @ApiResponse({ status: 201, description: 'PGA publicado, cópias geradas' })
  @ApiResponse({
    status: 400,
    description: 'PGA não é template ou já foi publicado',
  })
  publish(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.publishPgaService.execute(id, req.user.pessoa_id);
  }

  @Post(':id/aprovar-regional')
  @UseGuards(RolesGuard)
  @Roles('Regional')
  @ApiOperation({ summary: 'Aprovar PGA na regional' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiBody({ schema: { properties: { parecer: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'PGA aprovado pela regional' })
  aprovarRegional(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('parecer') parecer: string,
    @Request() req: any,
  ) {
    return this.reviewPgaRegionalService.aprovar(
      id,
      req.user.pessoa_id,
      parecer,
    );
  }

  @Post(':id/reprovar-regional')
  @UseGuards(RolesGuard)
  @Roles('Regional')
  @ApiOperation({ summary: 'Reprovar PGA na regional (devolve ao Diretor)' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiBody({
    schema: {
      properties: { parecer: { type: 'string', description: 'Obrigatório' } },
    },
  })
  @ApiResponse({ status: 200, description: 'PGA reprovado pela regional' })
  reprovarRegional(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('parecer') parecer: string,
    @Request() req: any,
  ) {
    return this.reviewPgaRegionalService.reprovar(
      id,
      req.user.pessoa_id,
      parecer,
    );
  }

  @Post(':id/aprovar-cps')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS')
  @ApiOperation({ summary: 'Aprovação final do PGA pelo CPS' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiBody({ schema: { properties: { parecer: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'PGA aprovado pelo CPS' })
  aprovarCps(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('parecer') parecer: string,
    @Request() req: any,
  ) {
    return this.reviewPgaCpsService.aprovar(id, req.user.pessoa_id, parecer);
  }

  @Post(':id/reprovar-cps')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'CPS')
  @ApiOperation({ summary: 'Reprovar PGA pelo CPS' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID do PGA' })
  @ApiBody({
    schema: {
      properties: { parecer: { type: 'string', description: 'Obrigatório' } },
    },
  })
  @ApiResponse({ status: 200, description: 'PGA reprovado pelo CPS' })
  reprovarCps(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('parecer') parecer: string,
    @Request() req: any,
  ) {
    return this.reviewPgaCpsService.reprovar(id, req.user.pessoa_id, parecer);
  }
}
