import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ConfigurationSnapshotService } from './services/configuration-snapshot.service';
import { VersionManagerService } from './services/version-manager.service';
import { AuditLogService } from './services/audit-log.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { TipoOperacaoAuditoria } from '@prisma/client';
import { ReportEntry, YearSummary, AuditSummaryResponse, ChangesReportResponse } from './types/audit.types';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly snapshotService: ConfigurationSnapshotService,
    private readonly versionService: VersionManagerService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Post('snapshot/pga/:pgaId')
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

  // 🔥 ENDPOINT QUE PRECISA FILTRAR POR ANO
  @Get('configurations/year/:ano')
  async getConfigurationsByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getConfigurationsByYear(ano);
  }

  @Get('configurations/situacoes-problema/year/:ano')
  async getSituacoesProblemaByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getSituacoesProblemaByYear(ano);
  }

  @Get('configurations/eixos-tematicos/year/:ano')
  async getEixosTematicosByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getEixosTematicosByYear(ano);
  }

  @Get('configurations/pessoas/year/:ano')
  async getPessoasByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getPessoasByYear(ano);
  }

  @Post('log')
  async createAuditLog(@Body() createAuditDto: CreateAuditDto) {
    return this.auditLogService.createLog(createAuditDto);
  }

  @Get('history/:tabela/:registroId')
  async getAuditHistory(
    @Param('tabela') tabela: string,
    @Param('registroId', ParseIntPipe) registroId: number,
  ) {
    return this.auditLogService.getAuditHistory(tabela, registroId);
  }

  @Get('year/:ano')
  async getAuditByYear(@Param('ano', ParseIntPipe) ano: number) {
    return this.auditLogService.getAuditByYear(ano);
  }

  @Get('table/:tabela')
  async getAuditByTable(@Param('tabela') tabela: string) {
    return this.auditLogService.getAuditByTable(tabela);
  }

  @Get('report/changes/year/:year')
  async getChangesReport(@Param('year', ParseIntPipe) year: number) {
    return this.auditLogService.getChangesReport(year);
  }

  @Get('report/summary')
  async getAuditSummary(
    @Query('startYear') startYear?: string,
    @Query('endYear') endYear?: string,
  ): Promise<AuditSummaryResponse> {
    const start = startYear ? parseInt(startYear, 10) : undefined;
    const end = endYear ? parseInt(endYear, 10) : undefined;
    return this.auditLogService.getAuditSummary(start, end);
  }

  @Get('table/:tableName')
  async getTableHistory(
    @Param('tableName') tableName: string,
    @Query('year') year?: string,
  ) {
    const yearInt = year ? parseInt(year, 10) : undefined;
    return this.auditLogService.getTableHistory(tableName, yearInt);
  }
}