import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';
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
    private readonly exportPgaCsvService: ExportPgaCsvService,
    private readonly exportPgaPdfService: ExportPgaPdfService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo PGA',
    description: 'Cria um novo Plano de Gestão Acadêmica',
  })
  @ApiBody({ type: CreatePgaDto })
  @ApiResponse({ status: 201, description: 'PGA criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: CreatePgaDto) {
    return this.createPgaService.execute(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar PGAs',
    description: 'Retorna lista de todos os PGAs',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de PGAs retornada com sucesso',
  })
  findAll(@Request() req: any) {
    return this.findAllPgaService.execute(req.user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar PGA por ID',
    description: 'Retorna dados de um PGA específico',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.findOnePgaService.execute(id, req.user);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar PGA',
    description: 'Atualiza dados de um PGA específico',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiBody({ type: UpdatePgaDto })
  @ApiResponse({ status: 200, description: 'PGA atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePgaDto) {
    return this.updatePgaService.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir PGA',
    description: 'Remove um PGA do sistema',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do PGA' })
  @ApiResponse({ status: 200, description: 'PGA excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'PGA não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deletePgaService.execute(id);
  }

  @Get(':id/export/csv')
  @ApiOperation({ summary: 'Exportar PGA como CSV' })
  async exportCsv(@Param('id', ParseIntPipe) id: number, @Request() req: any, @Res() res: Response) {
    const csv = await this.exportPgaCsvService.execute(id, req.user);
    const filename = `pga-${id}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get(':id/export/pdf')
  @ApiOperation({ summary: 'Exportar PGA como PDF' })
  async exportPdf(@Param('id', ParseIntPipe) id: number, @Request() req: any, @Res() res: Response) {
    const pdfBuffer = await this.exportPgaPdfService.execute(id, req.user);
    const filename = `pga-${id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  }
}
