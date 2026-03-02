import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Project1Repository } from '../project1.repository';
import { UpdateProject1Dto } from '../dto/update-project1.dto';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class UpdateProject1Service {
  constructor(
    private readonly project1Repository: Project1Repository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: number, data: UpdateProject1Dto) {
    try {
      const {
        situacoes_problema_ids,
        pessoas,
        etapas,
        ...projectData
      } = data;

      
      const basicFields = {} as any;
      for (const [key, value] of Object.entries(projectData)) {
        if (value !== undefined) {
          basicFields[key] = value;
        }
      }

      console.log('[UpdateProject1Service] Atualizando projeto com dados básicos:', { id, basicFields });

      if (Object.keys(basicFields).length > 0) {
        await this.project1Repository.update(id, basicFields as UpdateProject1Dto);
      }

      
      if (situacoes_problema_ids !== undefined && Array.isArray(situacoes_problema_ids)) {
        console.log('[UpdateProject1Service] Atualizando situações-problema:', { id, situacoes_problema_ids });
        
        
        await this.prisma.acaoProjetoSituacaoProblema.deleteMany({
          where: { acao_projeto_id: id },
        });

        
        const idsValidos = situacoes_problema_ids.filter((sid) => sid && Number(sid) > 0);
        if (idsValidos.length > 0) {
          console.log('[UpdateProject1Service] Criando situações-problema válidas:', { idsValidos });
          const createData = idsValidos.map((situacao_id) => ({
            acao_projeto_id: id,
            situacao_problema_id: Number(situacao_id),
            ativo: true,
          }));
          
          await this.prisma.acaoProjetoSituacaoProblema.createMany({
            data: createData,
          });
          console.log('[UpdateProject1Service] Situações-problema criadas com sucesso');
        }
      }

      
      if (pessoas !== undefined && Array.isArray(pessoas)) {
        console.log('[UpdateProject1Service] Atualizando pessoas:', { id, pessoas_count: pessoas.length });
        
        const pessoasValidas = pessoas.filter((p) => p && p.pessoa_id && Number(p.pessoa_id) > 0);
        console.log('[UpdateProject1Service] Pessoas válidas:', { count: pessoasValidas.length });
        
        const pessoasComId = pessoasValidas.filter((p) => p.projeto_pessoa_id && Number(p.projeto_pessoa_id) > 0);
        const idsExistentes = pessoasComId.map((p) => Number(p.projeto_pessoa_id!));

        if (idsExistentes.length === 0) {
          await this.prisma.projetoPessoa.deleteMany({
            where: { acao_projeto_id: id },
          });
        } else {
          await this.prisma.projetoPessoa.deleteMany({
            where: {
              acao_projeto_id: id,
              projeto_pessoa_id: { notIn: idsExistentes },
            },
          });
        }

        for (const pessoa of pessoasValidas) {
          const pessoaId = Number(pessoa.pessoa_id);
          const tipoVinculoId = pessoa.tipo_vinculo_hae_id ? Number(pessoa.tipo_vinculo_hae_id) : null;
          const cargaHoraria = pessoa.carga_horaria_semanal ? Number(pessoa.carga_horaria_semanal) : null;

          if (pessoa.projeto_pessoa_id && Number(pessoa.projeto_pessoa_id) > 0) {
            console.log('[UpdateProject1Service] Atualizando pessoa existente:', { projeto_pessoa_id: pessoa.projeto_pessoa_id });
            await this.prisma.projetoPessoa.update({
              where: { projeto_pessoa_id: Number(pessoa.projeto_pessoa_id) },
              data: {
                pessoa_id: pessoaId,
                papel: pessoa.papel || 'Colaborador',
                carga_horaria_semanal: cargaHoraria,
                tipo_vinculo_hae_id: tipoVinculoId,
                ativo: true,
              },
            });
          } else {
            console.log('[UpdateProject1Service] Criando nova pessoa');
            await this.prisma.projetoPessoa.create({
              data: {
                acao_projeto_id: id,
                pessoa_id: pessoaId,
                papel: pessoa.papel || 'Colaborador',
                carga_horaria_semanal: cargaHoraria,
                tipo_vinculo_hae_id: tipoVinculoId,
                ativo: true,
              },
            });
          }
        }
      }

      
      if (etapas !== undefined && Array.isArray(etapas)) {
        console.log('[UpdateProject1Service] Atualizando etapas:', { id, etapas_count: etapas.length });
        
        const etapasValidas = etapas.filter((e) => e && e.descricao && typeof e.descricao === 'string' && e.descricao.trim().length > 0);
        const etapasComId = etapasValidas.filter((e) => e.etapa_id && Number(e.etapa_id) > 0);
        const idsExistentes = etapasComId.map((e) => Number(e.etapa_id!));

        if (idsExistentes.length === 0) {
          await this.prisma.etapaProcesso.deleteMany({
            where: { acao_projeto_id: id },
          });
        } else {
          await this.prisma.etapaProcesso.deleteMany({
            where: {
              acao_projeto_id: id,
              etapa_id: { notIn: idsExistentes },
            },
          });
        }

        for (const etapa of etapasValidas) {
          const parseDate = (dateStr: string | undefined | null): Date | null => {
            if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
              return null;
            }
            const date = new Date(dateStr);
            return Number.isNaN(date.getTime()) ? null : date;
          };

          const dataPrevista = parseDate(etapa.data_verificacao_prevista);
          const dataRealizada = parseDate(etapa.data_verificacao_realizada);

          if (etapa.etapa_id && Number(etapa.etapa_id) > 0) {
            console.log('[UpdateProject1Service] Atualizando etapa existente:', { etapa_id: etapa.etapa_id });
            await this.prisma.etapaProcesso.update({
              where: { etapa_id: Number(etapa.etapa_id) },
              data: {
                descricao: etapa.descricao?.trim() || '',
                entregavel_id: etapa.entregavel_id ? Number(etapa.entregavel_id) : null,
                numero_ref: etapa.numero_ref || null,
                status_verificacao: etapa.status_verificacao as any || undefined,
                data_verificacao_prevista: dataPrevista,
                data_verificacao_realizada: dataRealizada,
              },
            });
          } else {
            console.log('[UpdateProject1Service] Criando nova etapa');
            await this.prisma.etapaProcesso.create({
              data: {
                acao_projeto_id: id,
                descricao: etapa.descricao?.trim() || '',
                entregavel_id: etapa.entregavel_id ? Number(etapa.entregavel_id) : null,
                numero_ref: etapa.numero_ref || null,
                status_verificacao: etapa.status_verificacao as any || undefined,
                data_verificacao_prevista: dataPrevista,
                data_verificacao_realizada: dataRealizada,
                ativo: true,
              },
            });
          }
        }
      }

      
      console.log('[UpdateProject1Service] Retornando projeto atualizado');
      return this.project1Repository.findOne(id);
    } catch (error) {
      console.error('[UpdateProject1Service] Erro ao atualizar projeto:', error);
      throw error;
    }
  }
}
