import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigurationSnapshotService } from './services/configuration-snapshot.service';
import { VersionManagerService } from './services/version-manager.service';
import { AuditLogService } from './services/audit-log.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { TipoOperacaoAuditoria } from '@prisma/client';
import {
  ReportEntry,
  YearSummary,
  AuditSummaryResponse,
  ChangesReportResponse,
} from './types/audit.types';

@ApiTags('Audit')
@ApiBearerAuth('JWT-auth')
@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(
    private readonly snapshotService: ConfigurationSnapshotService,
    private readonly versionService: VersionManagerService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Post('snapshot/pga/:pgaId')
  @ApiOperation({
    summary: 'Criar snapshot de configurações para PGA',
    description: 'Cria snapshot das configurações ativas para um PGA',
  })
  @ApiParam({ name: 'pgaId', type: 'number', description: 'ID do PGA' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { ano: { type: 'number' }, usuarioId: { type: 'number' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Snapshot criado com sucesso' })
  async criarSnapshotPGA(
    @Param('pgaId', ParseIntPipe) pgaId: number,
    @Body() body: { ano: number; usuarioId: number },
  ) {
    return this.snapshotService.criarSnapshotParaPGA(
      pgaId,
      body.ano,
      body.usuarioId,
    );
  }

  @Get('configurations/year/:ano')
  @ApiOperation({
    summary: 'Buscar configurações por ano',
    description: 'Retorna configurações ativas para um ano específico',
  })
  @ApiParam({
    name: 'ano',
    type: 'number',
    description: 'Ano das configurações',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações retornadas com sucesso',
  })
  async getConfigurationsByYear(@Request() req: any, @Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getConfigurationsByYear(ano, req.user?.active_context);
  }

  @Get('configurations/situacoes-problema/year/:ano')
  @ApiOperation({
    summary: 'Buscar situações problema por ano',
    description: 'Retorna situações problema ativas para um ano',
  })
  @ApiParam({
    name: 'ano',
    type: 'number',
    description: 'Ano das situações problema',
  })
  @ApiResponse({
    status: 200,
    description: 'Situações problema retornadas com sucesso',
  })
  async getSituacoesProblemaByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getSituacoesProblemaByYear(ano);
  }

  @Get('configurations/eixos-tematicos/year/:ano')
  @ApiOperation({
    summary: 'Buscar eixos temáticos por ano',
    description: 'Retorna eixos temáticos ativos para um ano',
  })
  @ApiParam({
    name: 'ano',
    type: 'number',
    description: 'Ano dos eixos temáticos',
  })
  @ApiResponse({
    status: 200,
    description: 'Eixos temáticos retornados com sucesso',
  })
  async getEixosTematicosByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getEixosTematicosByYear(ano);
  }

  @Get('configurations/pessoas/year/:ano')
  @ApiOperation({
    summary: 'Buscar pessoas por ano',
    description: 'Retorna pessoas ativas para um ano específico',
  })
  @ApiParam({ name: 'ano', type: 'number', description: 'Ano das pessoas' })
  @ApiResponse({ status: 200, description: 'Pessoas retornadas com sucesso' })
  async getPessoasByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getPessoasByYear(ano);
  }

  @Post('log')
  @ApiOperation({
    summary: 'Criar log de auditoria',
    description: 'Cria novo registro de auditoria',
  })
  @ApiBody({ type: CreateAuditDto })
  @ApiResponse({
    status: 201,
    description: 'Log de auditoria criado com sucesso',
  })
  async createAuditLog(@Body() createAuditDto: CreateAuditDto) {
    return this.auditLogService.createLog(createAuditDto);
  }

  @Get('history/:tabela/:registroId')
  @ApiOperation({
    summary: 'Buscar histórico de auditoria',
    description: 'Retorna histórico de mudanças de um registro',
  })
  @ApiParam({ name: 'tabela', type: 'string', description: 'Nome da tabela' })
  @ApiParam({
    name: 'registroId',
    type: 'number',
    description: 'ID do registro',
  })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  async getAuditHistory(
    @Param('tabela') tabela: string,
    @Param('registroId', ParseIntPipe) registroId: number,
  ) {
    return this.auditLogService.getAuditHistory(tabela, registroId);
  }

  @Get('year/:ano')
  @ApiOperation({
    summary: 'Buscar auditoria por ano',
    description: 'Retorna logs de auditoria de um ano específico',
  })
  @ApiParam({ name: 'ano', type: 'number', description: 'Ano da auditoria' })
  @ApiResponse({ status: 200, description: 'Logs retornados com sucesso' })
  async getAuditByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getAuditByYear(ano);
  }

  @Get('table/:tabela')
  @ApiOperation({
    summary: 'Buscar auditoria por tabela',
    description: 'Retorna logs de auditoria de uma tabela específica',
  })
  @ApiParam({ name: 'tabela', type: 'string', description: 'Nome da tabela' })
  @ApiResponse({ status: 200, description: 'Logs retornados com sucesso' })
  async getAuditByTable(@Param('tabela') tabela: string) {
    return this.auditLogService.getAuditByTable(tabela);
  }

  @Get('report/changes/year/:year')
  @ApiOperation({
    summary: 'Relatório de mudanças por ano',
    description: 'Gera relatório de mudanças ocorridas em um ano',
  })
  @ApiParam({ name: 'year', type: 'number', description: 'Ano do relatório' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso' })
  async getChangesReport(@Param('year', ParseIntPipe) year: number) {
    return this.auditLogService.getChangesReport(year);
  }

  @Get('report/summary')
  @ApiOperation({
    summary: 'Resumo de auditoria',
    description: 'Retorna resumo estatístico da auditoria por período',
  })
  @ApiQuery({
    name: 'startYear',
    type: 'string',
    required: false,
    description: 'Ano de início',
  })
  @ApiQuery({
    name: 'endYear',
    type: 'string',
    required: false,
    description: 'Ano de fim',
  })
  @ApiResponse({ status: 200, description: 'Resumo retornado com sucesso' })
  async getAuditSummary(
    @Query('startYear') startYear?: string,
    @Query('endYear') endYear?: string,
  ): Promise<AuditSummaryResponse> {
    const start = startYear ? parseInt(startYear, 10) : undefined;
    const end = endYear ? parseInt(endYear, 10) : undefined;
    return this.auditLogService.getAuditSummary(start, end);
  }

  @Get('table/:tableName')
  @ApiOperation({
    summary: 'Histórico de tabela',
    description: 'Retorna histórico de mudanças de uma tabela',
  })
  @ApiParam({
    name: 'tableName',
    type: 'string',
    description: 'Nome da tabela',
  })
  @ApiQuery({
    name: 'year',
    type: 'string',
    required: false,
    description: 'Ano para filtrar',
  })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  async getTableHistory(
    @Param('tableName') tableName: string,
    @Query('year') year?: string,
  ) {
    const yearInt = year ? parseInt(year, 10) : undefined;
    return this.auditLogService.getTableHistory(tableName, yearInt);
  }
}
