import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateAuditDto } from '../dto/create-audit.dto';
import {
  ChangesReportResponse,
  AuditSummaryResponse,
} from '../types/audit.types';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLog(createAuditDto: CreateAuditDto) {
    try {
      const auditLog = await this.prisma.configuracaoAuditoria.create({
        data: {
          tabela: createAuditDto.tabela,
          registro_id: createAuditDto.registro_id,
          ano: createAuditDto.ano,
          operacao: createAuditDto.operacao,
          dados_antes: createAuditDto.dados_antes,
          dados_depois: createAuditDto.dados_depois,
          usuario_id: createAuditDto.usuario_id,
          motivo: createAuditDto.motivo,
          data_operacao: new Date(),
        },
      });

      this.logger.log(
        `📝 Log de auditoria criado: ${createAuditDto.tabela}.${createAuditDto.operacao}`,
      );
      return auditLog;
    } catch (error) {
      this.logger.error(
        `Erro ao criar log de auditoria: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getChangesReport(year: number): Promise<ChangesReportResponse> {
    try {
      const auditRecords = await this.prisma.configuracaoAuditoria.findMany({
        where: { ano: year },
        include: {
          usuario: {
            select: { nome: true },
          },
        },
        orderBy: { data_operacao: 'desc' },
      });

      const groupedData = auditRecords.reduce(
        (acc, record) => {
          const key = `${record.tabela}-${record.operacao}`;
          if (!acc[key]) {
            acc[key] = {
              tabela: record.tabela,
              operacao: record.operacao,
              count: 0,
              registros: [],
            };
          }
          acc[key].count++;
          acc[key].registros.push({
            registro_id: record.registro_id,
            data_operacao: record.data_operacao,
            usuario: record.usuario?.nome || 'Sistema',
            motivo: record.motivo,
          });
          return acc;
        },
        {} as Record<string, any>,
      );

      const resumo = Object.values(groupedData);

      return {
        ano: year,
        resumo,
        total_operacoes: auditRecords.length,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Erro ao gerar relatório de mudanças: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAuditSummary(
    startYear?: number,
    endYear?: number,
  ): Promise<AuditSummaryResponse> {
    try {
      const currentYear = new Date().getFullYear();
      const inicio = startYear || currentYear - 2;
      const fim = endYear || currentYear;

      const auditRecords = await this.prisma.configuracaoAuditoria.findMany({
        where: {
          ano: { gte: inicio, lte: fim },
        },
        select: { ano: true, operacao: true },
      });

      const anoData = auditRecords.reduce(
        (acc, record) => {
          if (!acc[record.ano]) {
            acc[record.ano] = {
              ano: record.ano,
              total_operacoes: 0,
              operacoes_por_tipo: {},
            };
          }
          acc[record.ano].total_operacoes++;
          acc[record.ano].operacoes_por_tipo[record.operacao] =
            (acc[record.ano].operacoes_por_tipo[record.operacao] || 0) + 1;
          return acc;
        },
        {} as Record<number, any>,
      );

      return {
        periodo: { inicio, fim },
        anos: Object.values(anoData),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Erro ao gerar resumo de auditoria: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getConfigurationsByYear(ano: number, active_context?: any) {
    try {
      console.log(
        `🔍 AuditLogService - Buscando configurações para o ano: ${ano}`,
      );

      const [
        situacoesProblema,
        eixosTematicos,
        prioridades,
        temas,
        entregaveis,
        pessoas,
      ] = await Promise.all([
        this.getSituacoesProblemaByYear(ano),
        this.getEixosTematicosByYear(ano),
        this.getPrioridadesByYear(ano),
        this.getTemasByYear(ano),
        this.getEntregaveisByYear(ano, active_context),
        this.getPessoasByYear(ano),
      ]);

      const result = {
        ano,
        configuracoes: {
          situacoesProblema,
          eixosTematicos,
          prioridades,
          temas,
          entregaveis,
          pessoas,
        },
        timestamp: new Date().toISOString(),
      };

      console.log(`✅ Configurações encontradas para ${ano}:`, {
        situacoesProblema: situacoesProblema.length,
        eixosTematicos: eixosTematicos.length,
        prioridades: prioridades.length,
        temas: temas.length,
        entregaveis: entregaveis.length,
        pessoas: pessoas.length,
      });

      return result;
    } catch (error) {
      console.error(`❌ Erro ao buscar configurações para ${ano}:`, error);
      throw error;
    }
  }

  async getSituacoesProblemaByYear(ano: number) {
    try {
      console.log(`📋 Buscando situações problema para ${ano}...`);

      const situacoesAuditoria =
        await this.prisma.configuracaoAuditoria.findMany({
          where: {
            tabela: 'situacao_problema',
            operacao: 'CREATE',
            ano: { lte: ano },
          },
          select: { registro_id: true },
          distinct: ['registro_id'],
        });

      const situacaoIds = situacoesAuditoria.map((audit) => audit.registro_id);
      console.log(`📋 IDs na auditoria: [${situacaoIds.join(', ')}]`);

      if (situacaoIds.length > 0) {
        const situacoes = await this.prisma.situacaoProblema.findMany({
          where: {
            situacao_id: { in: situacaoIds },
          },
          orderBy: { situacao_id: 'asc' },
        });

        console.log(
          `📋 SituacoesProblema via auditoria para ${ano}: ${situacoes.length} registros`,
        );
        return situacoes;
      }

      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
      const situacoes = await this.prisma.situacaoProblema.findMany({
        where: {
          criado_em: {
            lte: endOfYear,
          },
        },
        orderBy: { situacao_id: 'asc' },
      });

      console.log(
        `📋 SituacoesProblema filtradas por criado_em para ${ano}: ${situacoes.length} registros`,
      );
      return situacoes;
    } catch (error) {
      console.error(`❌ Erro ao buscar situações problema para ${ano}:`, error);
      return [];
    }
  }

  async getEixosTematicosByYear(ano: number) {
    try {
      console.log(`📊 Buscando eixos temáticos para ${ano}...`);

      const eixosAuditoria = await this.prisma.configuracaoAuditoria.findMany({
        where: {
          tabela: 'eixo_tematico',
          operacao: 'CREATE',
          ano: { lte: ano },
        },
        select: { registro_id: true },
        distinct: ['registro_id'],
      });

      const eixoIds = eixosAuditoria.map((audit) => audit.registro_id);
      console.log(`📊 IDs na auditoria: [${eixoIds.join(', ')}]`);

      if (eixoIds.length > 0) {
        const eixos = await this.prisma.eixoTematico.findMany({
          where: {
            eixo_id: { in: eixoIds },
          },
          orderBy: { numero: 'asc' },
        });

        console.log(
          `📊 EixosTematicos via auditoria para ${ano}: ${eixos.length} registros`,
        );
        return eixos;
      }

      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
      const eixos = await this.prisma.eixoTematico.findMany({
        where: {
          criado_em: {
            lte: endOfYear,
          },
        },
        orderBy: { numero: 'asc' },
      });

      console.log(
        `📊 EixosTematicos filtrados por criado_em para ${ano}: ${eixos.length} registros`,
      );
      return eixos;
    } catch (error) {
      console.error(`❌ Erro ao buscar eixos temáticos para ${ano}:`, error);
      return [];
    }
  }

  async getPrioridadesByYear(ano: number) {
    try {
      console.log(`⭐ Buscando prioridades para ${ano}...`);

      const prioridadesAuditoria =
        await this.prisma.configuracaoAuditoria.findMany({
          where: {
            tabela: 'prioridade_acao',
            operacao: 'CREATE',
            ano: { lte: ano },
          },
          select: { registro_id: true },
          distinct: ['registro_id'],
        });

      const prioridadeIds = prioridadesAuditoria.map(
        (audit) => audit.registro_id,
      );
      console.log(`⭐ IDs na auditoria: [${prioridadeIds.join(', ')}]`);

      if (prioridadeIds.length > 0) {
        const prioridades = await this.prisma.prioridadeAcao.findMany({
          where: {
            prioridade_id: { in: prioridadeIds },
          },
          orderBy: { grau: 'asc' },
        });

        console.log(
          `⭐ PrioridadeAcao via auditoria para ${ano}: ${prioridades.length} registros`,
        );
        return prioridades;
      }

      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
      const prioridades = await this.prisma.prioridadeAcao.findMany({
        where: {
          criado_em: {
            lte: endOfYear,
          },
        },
        orderBy: { grau: 'asc' },
      });

      console.log(
        `⭐ PrioridadeAcao filtradas por criado_em para ${ano}: ${prioridades.length} registros`,
      );
      return prioridades;
    } catch (error) {
      console.error(`❌ Erro ao buscar prioridades para ${ano}:`, error);
      return [];
    }
  }

  async getTemasByYear(ano: number) {
    try {
      console.log(`🎯 Buscando temas para ${ano}...`);

      const temasAuditoria = await this.prisma.configuracaoAuditoria.findMany({
        where: {
          tabela: 'tema',
          operacao: 'CREATE',
          ano: { lte: ano },
        },
        select: { registro_id: true },
        distinct: ['registro_id'],
      });

      const temaIds = temasAuditoria.map((audit) => audit.registro_id);
      console.log(`🎯 IDs na auditoria: [${temaIds.join(', ')}]`);

      if (temaIds.length > 0) {
        const temas = await this.prisma.tema.findMany({
          where: {
            tema_id: { in: temaIds },
          },
          include: {
            eixo: {
              select: { nome_eixo: true },
            },
          },
          orderBy: { tema_num: 'asc' },
        });

        console.log(
          `🎯 Temas via auditoria para ${ano}: ${temas.length} registros`,
        );
        return temas;
      }

      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
      const temas = await this.prisma.tema.findMany({
        where: {
          criado_em: {
            lte: endOfYear,
          },
        },
        include: {
          eixo: {
            select: { nome_eixo: true },
          },
        },
        orderBy: { tema_num: 'asc' },
      });

      console.log(
        `🎯 Temas filtrados por criado_em para ${ano}: ${temas.length} registros`,
      );
      return temas;
    } catch (error) {
      console.error(`❌ Erro ao buscar temas para ${ano}:`, error);
      return [];
    }
  }

  async getEntregaveisByYear(ano: number, active_context?: any) {
    try {
      console.log(`📦 Buscando entregáveis para ${ano}...`);

      const entregaveisAuditoria =
        await this.prisma.configuracaoAuditoria.findMany({
          where: {
            tabela: 'entregavel_link_sei',
            operacao: 'CREATE',
            ano: { lte: ano },
          },
          select: { registro_id: true },
          distinct: ['registro_id'],
        });

      const entregavelIds = entregaveisAuditoria.map(
        (audit) => audit.registro_id,
      );
      console.log(`📦 IDs na auditoria: [${entregavelIds.join(', ')}]`);

      if (entregavelIds.length > 0) {
        const where: any = { entregavel_id: { in: entregavelIds } };
        if (active_context?.tipo === 'unidade')
          where.unidade_id = active_context.id;
        if (active_context?.tipo === 'regional')
          where.regional_id = active_context.id;

        const entregaveis = await this.prisma.entregavelLinkSei.findMany({
          where,
          orderBy: { entregavel_id: 'asc' },
        });

        console.log(
          `📦 EntregavelLinkSei via auditoria para ${ano}: ${entregaveis.length} registros`,
        );
        return entregaveis;
      }

      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
      const where: any = { criado_em: { lte: endOfYear } };
      if (active_context?.tipo === 'unidade')
        where.unidade_id = active_context.id;
      if (active_context?.tipo === 'regional')
        where.regional_id = active_context.id;

      const entregaveis = await this.prisma.entregavelLinkSei.findMany({
        where,
        orderBy: { entregavel_id: 'asc' },
      });

      console.log(
        `📦 EntregavelLinkSei filtrados por criado_em para ${ano}: ${entregaveis.length} registros`,
      );
      return entregaveis;
    } catch (error) {
      console.error(`❌ Erro ao buscar entregáveis para ${ano}:`, error);
      return [];
    }
  }

  async getPessoasByYear(ano: number) {
    try {
      console.log(`👥 Buscando pessoas que existiam até ${ano}...`);

      const pessoasAuditoria = await this.prisma.configuracaoAuditoria.findMany(
        {
          where: {
            tabela: 'pessoa',
            operacao: 'CREATE',
            ano: { lte: ano },
          },
          select: { registro_id: true },
          distinct: ['registro_id'],
        },
      );

      const pessoaIds = pessoasAuditoria.map((audit) => audit.registro_id);
      console.log(`📋 IDs de pessoas na auditoria: [${pessoaIds.join(', ')}]`);

      if (pessoaIds.length > 0) {
        const pessoas = await this.prisma.pessoa.findMany({
          where: {
            pessoa_id: { in: pessoaIds },
          },
          select: {
            pessoa_id: true,
            nome: true,
            email: true,
            tipo_usuario: true,
            criado_em: true,
          },
          orderBy: { pessoa_id: 'asc' },
        });

        console.log(
          `👥 Pessoas via auditoria para ${ano}: ${pessoas.length} registros`,
        );
        pessoas.forEach((pessoa, index) => {
          console.log(
            `   ${index + 1}. ${pessoa.nome} (ID: ${pessoa.pessoa_id}) - Criado: ${pessoa.criado_em?.toISOString()}`,
          );
        });

        return pessoas;
      }

      console.log(
        `⚠️ Nenhuma pessoa na auditoria, usando filtro por criado_em...`,
      );
      const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);

      const pessoas = await this.prisma.pessoa.findMany({
        where: {
          criado_em: {
            lte: endOfYear,
          },
        },
        select: {
          pessoa_id: true,
          nome: true,
          email: true,
          tipo_usuario: true,
          criado_em: true,
        },
        orderBy: { pessoa_id: 'asc' },
      });

      console.log(
        `👥 Pessoas filtradas por criado_em para ${ano}: ${pessoas.length} registros`,
      );
      console.log(`📅 Filtro: criado_em <= ${endOfYear.toISOString()}`);

      pessoas.forEach((pessoa, index) => {
        console.log(
          `   ${index + 1}. ${pessoa.nome} (ID: ${pessoa.pessoa_id}) - Criado: ${pessoa.criado_em?.toISOString()}`,
        );
      });

      return pessoas;
    } catch (error) {
      console.error(`❌ Erro ao buscar pessoas para ${ano}:`, error);
      return [];
    }
  }

  async getTableHistory(tableName: string, year?: number) {
    const whereCondition: any = { tabela: tableName };
    if (year) {
      whereCondition.ano = year;
    }

    return this.prisma.configuracaoAuditoria.findMany({
      where: whereCondition,
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
      },
      orderBy: { data_operacao: 'desc' },
    });
  }

  async getAuditHistory(tabela: string, registroId: string) {
    return this.prisma.configuracaoAuditoria.findMany({
      where: { tabela, registro_id: registroId },
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
      },
      orderBy: { data_operacao: 'desc' },
    });
  }

  async getAuditByYear(ano: number) {
    return this.prisma.configuracaoAuditoria.findMany({
      where: { ano },
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
      },
      orderBy: { data_operacao: 'desc' },
    });
  }

  async getAuditByTable(tabela: string) {
    return this.prisma.configuracaoAuditoria.findMany({
      where: { tabela },
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
      },
      orderBy: { data_operacao: 'desc' },
    });
  }
}
