import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { VersionRepository } from '../repositories/version.repository';
import { AuditRepository } from '../repositories/audit.repository';
import { TipoOperacaoAuditoria, SituacaoProblemaVersao, EixoTematicoVersao, PrioridadeAcaoVersao, TemaVersao, EntregavelVersao, PessoaVersao } from '@prisma/client';

@Injectable()
export class ConfigurationSnapshotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly versionRepository: VersionRepository,
    private readonly auditRepository: AuditRepository,
  ) {}

  async criarSnapshotParaPGA(pgaId: number, ano: number, usuarioId: number) {
    console.log(`Criando snapshot para PGA ${pgaId} do ano ${ano}`);

    const snapshot = {
      situacoesProblema: await this.criarVersoesSituacoesProblema(ano, usuarioId),
      eixosTematicos: await this.criarVersoesEixosTematicos(ano, usuarioId),
      prioridades: await this.criarVersoesPrioridades(ano, usuarioId),
      temas: await this.criarVersoesTemas(ano, usuarioId),
      entregaveis: await this.criarVersoesEntregaveis(ano, usuarioId),
      pessoas: await this.criarVersoesPessoas(ano, usuarioId),
      timestampSnapshot: new Date(),
    };

    // Salvar snapshot no PGA
    await this.prisma.pGA.update({
      where: { pga_id: pgaId },
      data: {
        configuracoes_snapshot: snapshot,
        data_snapshot_criado: new Date(),
        usuario_criacao_id: usuarioId,
      },
    });

    // Registrar na auditoria
    await this.auditRepository.createAuditLog({
      tabela: 'pga',
      registro_id: pgaId,
      ano: ano,
      operacao: TipoOperacaoAuditoria.SNAPSHOT_CREATED,
      dados_depois: snapshot,
      usuario_id: usuarioId,
      motivo: `Snapshot criado automaticamente para PGA ${pgaId} do ano ${ano}`,
    });

    console.log(`Snapshot criado com sucesso para PGA ${pgaId}`);
    return snapshot;
  }

  private async criarVersoesSituacoesProblema(ano: number, usuarioId: number): Promise<SituacaoProblemaVersao[]> {
    const situacoesAtivas = await this.prisma.situacaoProblema.findMany({
      where: { ativo: true },
    });

    const versoes: SituacaoProblemaVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const situacao of situacoesAtivas) {
      try {
        // Verifica se já existe versão para este ano
        const versaoExistente = await this.prisma.situacaoProblemaVersao.findUnique({
          where: {
            situacao_base_id_ano: {
              situacao_base_id: situacao.situacao_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createSituacaoProblemaVersion({
            situacao_base_id: situacao.situacao_id,
            ano: ano,
            codigo_categoria: situacao.codigo_categoria,
            descricao: situacao.descricao,
            fonte: situacao.fonte ?? undefined, // CORRIGIDO: conversão null -> undefined
            ordem: situacao.ordem ?? undefined, // CORRIGIDO: conversão null -> undefined
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          // Log de auditoria
          await this.auditRepository.createAuditLog({
            tabela: 'situacao_problema',
            registro_id: situacao.situacao_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para situação ${situacao.situacao_id}:`, error);
      }
    }

    return versoes;
  }

  private async criarVersoesEixosTematicos(ano: number, usuarioId: number): Promise<EixoTematicoVersao[]> {
    const eixosAtivos = await this.prisma.eixoTematico.findMany({
      where: { ativo: true },
    });

    const versoes: EixoTematicoVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const eixo of eixosAtivos) {
      try {
        const versaoExistente = await this.prisma.eixoTematicoVersao.findUnique({
          where: {
            eixo_base_id_ano: {
              eixo_base_id: eixo.eixo_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createEixoTematicoVersion({
            eixo_base_id: eixo.eixo_id,
            ano: ano,
            numero: eixo.numero,
            nome: eixo.nome,
            descricao: eixo.descricao ?? undefined, // CORRIGIDO: conversão null -> undefined
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          await this.auditRepository.createAuditLog({
            tabela: 'eixo_tematico',
            registro_id: eixo.eixo_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para eixo ${eixo.eixo_id}:`, error);
      }
    }

    return versoes;
  }

  private async criarVersoesPrioridades(ano: number, usuarioId: number): Promise<PrioridadeAcaoVersao[]> {
    const prioridadesAtivas = await this.prisma.prioridadeAcao.findMany({
      where: { ativo: true },
    });

    const versoes: PrioridadeAcaoVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const prioridade of prioridadesAtivas) {
      try {
        const versaoExistente = await this.prisma.prioridadeAcaoVersao.findUnique({
          where: {
            prioridade_base_id_ano: {
              prioridade_base_id: prioridade.prioridade_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createPrioridadeAcaoVersion({
            prioridade_base_id: prioridade.prioridade_id,
            ano: ano,
            grau: prioridade.grau,
            descricao: prioridade.descricao,
            tipo_gestao: prioridade.tipo_gestao,
            detalhes: prioridade.detalhes ?? undefined, // CORRIGIDO: conversão null -> undefined
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          await this.auditRepository.createAuditLog({
            tabela: 'prioridade_acao',
            registro_id: prioridade.prioridade_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para prioridade ${prioridade.prioridade_id}:`, error);
      }
    }

    return versoes;
  }

  private async criarVersoesTemas(ano: number, usuarioId: number): Promise<TemaVersao[]> {
    const temasAtivos = await this.prisma.tema.findMany({
      where: { ativo: true },
    });

    const versoes: TemaVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const tema of temasAtivos) {
      try {
        const versaoExistente = await this.prisma.temaVersao.findUnique({
          where: {
            tema_base_id_ano: {
              tema_base_id: tema.tema_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createTemaVersion({
            tema_base_id: tema.tema_id,
            ano: ano,
            tema_num: tema.tema_num,
            eixo_id: tema.eixo_id,
            descricao: tema.descricao,
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          await this.auditRepository.createAuditLog({
            tabela: 'tema',
            registro_id: tema.tema_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para tema ${tema.tema_id}:`, error);
      }
    }

    return versoes;
  }

  private async criarVersoesEntregaveis(ano: number, usuarioId: number): Promise<EntregavelVersao[]> {
    const entregaveisAtivos = await this.prisma.entregavelLinkSei.findMany({
      where: { ativo: true },
    });

    const versoes: EntregavelVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const entregavel of entregaveisAtivos) {
      try {
        const versaoExistente = await this.prisma.entregavelVersao.findUnique({
          where: {
            entregavel_base_id_ano: {
              entregavel_base_id: entregavel.entregavel_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createEntregavelVersion({
            entregavel_base_id: entregavel.entregavel_id,
            ano: ano,
            entregavel_numero: entregavel.entregavel_numero,
            descricao: entregavel.descricao,
            detalhes: entregavel.detalhes ?? undefined, // CORRIGIDO: conversão null -> undefined
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          await this.auditRepository.createAuditLog({
            tabela: 'entregavel_link_sei',
            registro_id: entregavel.entregavel_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para entregável ${entregavel.entregavel_id}:`, error);
      }
    }

    return versoes;
  }

  private async criarVersoesPessoas(ano: number, usuarioId: number): Promise<PessoaVersao[]> {
    const pessoasAtivas = await this.prisma.pessoa.findMany({
      where: { ativo: true },
    });

    const versoes: PessoaVersao[] = []; // CORRIGIDO: tipo explícito
    
    for (const pessoa of pessoasAtivas) {
      try {
        const versaoExistente = await this.prisma.pessoaVersao.findUnique({
          where: {
            pessoa_base_id_ano: {
              pessoa_base_id: pessoa.pessoa_id,
              ano: ano,
            },
          },
        });

        if (!versaoExistente) {
          const novaVersao = await this.versionRepository.createPessoaVersion({
            pessoa_base_id: pessoa.pessoa_id,
            ano: ano,
            nome: pessoa.nome,
            email: pessoa.email ?? undefined, // CORRIGIDO: conversão null -> undefined
            tipo_usuario: pessoa.tipo_usuario,
            criado_por: usuarioId,
            motivo_alteracao: `Versão criada automaticamente para ano ${ano}`,
          });

          versoes.push(novaVersao);

          await this.auditRepository.createAuditLog({
            tabela: 'pessoa',
            registro_id: pessoa.pessoa_id,
            ano: ano,
            operacao: TipoOperacaoAuditoria.CREATE,
            dados_depois: novaVersao,
            usuario_id: usuarioId,
            motivo: `Versão ${ano} criada automaticamente`,
          });
        }
      } catch (error) {
        console.error(`Erro ao criar versão para pessoa ${pessoa.pessoa_id}:`, error);
      }
    }

    return versoes;
  }
}