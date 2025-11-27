import { Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';

@Injectable()
export class ExportPgaCsvService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(id: number, user?: any): Promise<string> {
    const active = user?.active_context ?? null;
    const activeContext = user?.active_context ?? null;
    const hasAccess = await this.repository.findOneWithContext(id, activeContext);
    if (!hasAccess) throw new NotFoundException('PGA não encontrada ou sem acesso');

    const pga = await this.repository.findOneWithRelations(id);
    if (!pga) throw new NotFoundException('PGA não encontrada após carregamento de relações');

    const unidadeNome = (pga as any).unidade?.nome_unidade ?? '';

    const metaCols = ['pga_id', 'ano', 'versao', 'unidade_id', 'unidade_nome', 'analise_cenario', 'status', 'regional_responsavel_id', 'parecer_regional'];
    const metaValues = [
      pga.pga_id,
      pga.ano,
      pga.versao ?? '',
      pga.unidade_id ?? '',
      '"' + String(unidadeNome).replace(/"/g, '""') + '"',
      '"' + String(pga.analise_cenario ?? '').replace(/"/g, '""') + '"',
      pga.status ?? '',
      pga.regional_responsavel_id ?? '',
      '"' + String(pga.parecer_regional ?? '').replace(/"/g, '""') + '"',
    ];

    let csv = `${metaCols.join(',')}\n${metaValues.join(',')}\n\n`;

    const situacaoCountMap: Record<number, { descricao: string; count: number }> = {};
    const projetos = (pga as any).acoesProjetos ?? [];
    for (const proj of projetos) {
      const sps = proj.situacoesProblemas ?? [];
      for (const sp of sps) {
        const idSp = sp.situacao_problema_id ?? sp.situacao_id ?? (sp.situacaoProblema?.situacao_id ?? 0);
        const desc = sp.situacaoProblema?.descricao ?? sp.descricao ?? '';
        if (!idSp) continue;
        if (!situacaoCountMap[idSp]) situacaoCountMap[idSp] = { descricao: desc, count: 0 };
        situacaoCountMap[idSp].count += 1;
      }
    }

    const situacoesOrdenadas = Object.keys(situacaoCountMap)
      .map((k) => ({ situacao_id: Number(k), descricao: situacaoCountMap[Number(k)].descricao, count: situacaoCountMap[Number(k)].count }))
      .sort((a, b) => b.count - a.count);

    if (situacoesOrdenadas.length) {
      csv += 'situacao_id,situacao_descricao,usos\n';
      for (const s of situacoesOrdenadas) {
        csv += `${s.situacao_id},"${String(s.descricao).replace(/"/g, '""')}",${s.count}\n`;
      }
      csv += '\n';
    }

    const eixoMap: Record<number, { eixo_nome: string; projetos: any[] }> = {};
    for (const proj of projetos) {
      const eixo = proj.eixo ?? { numero: 0, nome_eixo: '' };
      const eixoNum = eixo.numero ?? 0;
      if (!eixoMap[eixoNum]) eixoMap[eixoNum] = { eixo_nome: eixo.nome_eixo ?? '', projetos: [] };
      eixoMap[eixoNum].projetos.push(proj);
    }

    const eixosOrdenados = Object.keys(eixoMap)
      .map((k) => ({ numero: Number(k), nome: eixoMap[Number(k)].eixo_nome, projetos: eixoMap[Number(k)].projetos }))
      .sort((a, b) => a.numero - b.numero);

    csv += 'eixo_num,eixo_nome,projeto_codigo,projeto_nome,tema_num,prioridade_grau,responsavel,collaboradores,colaboradores_detalhados,situacoes_problema,o_que_sera_feito,por_que_sera_feito,objetivos_institucionais_referenciados,custo_total_estimado,fonte_recursos,data_inicio,data_final,etapas_count,entregaveis_count,etapas_detalhes\n';

    for (const eixo of eixosOrdenados) {
      eixo.projetos.sort((a: any, b: any) => {
        const pa = parseInt(String(a.codigo_projeto || '').trim().split(/[^0-9]/)[0] || '0', 10);
        const pb = parseInt(String(b.codigo_projeto || '').trim().split(/[^0-9]/)[0] || '0', 10);
        return pa - pb;
      });

      for (const proj of eixo.projetos) {
        const temaNum = proj.tema?.tema_num ?? '';
        const pri = proj.prioridade?.grau ?? '';
        const pessoas = proj.pessoas ?? [];
        const responsavel = pessoas.find((pp: any) => pp.papel === 'Responsavel')?.pessoa?.nome ?? '';
        const colaboradores = pessoas.filter((pp: any) => pp.papel !== 'Responsavel').map((pp: any) => pp.pessoa?.nome).filter(Boolean).join('; ');
        const colaboradoresDetalhados = pessoas
          .filter((pp: any) => pp.papel !== 'Responsavel')
          .map((pp: any) => `${pp.pessoa?.nome ?? ''}${pp.carga_horaria_semanal ? ` (CH/sem: ${pp.carga_horaria_semanal})` : ''}${pp.tipo_vinculo_hae ? ` (Tipo: ${pp.tipo_vinculo_hae.sigla ?? pp.tipo_vinculo_hae.descricao ?? ''})` : ''}`)
          .filter(Boolean)
          .join('; ');
        const etapas = proj.etapas ?? [];
        let entregaveisCount = 0;
        for (const e of etapas) {
          if (e.entregavel || e.entregavel_link_sei) entregaveisCount += 1;
        }

        const oQue = proj.o_que_sera_feito ?? '';
        const porQue = proj.por_que_sera_feito ?? '';
        const objetivosRef = proj.objetivos_institucionais_referenciados ?? '';
        const situacoesArr = (proj.situacoesProblemas ?? [])
          .map((sp: any) => {
            if (!sp) return '';
            if (sp.situacaoProblema && sp.situacaoProblema.descricao) {
              return sp.situacaoProblema.descricao;
            }
            if (sp.descricao) {
              return sp.descricao;
            }
            return '';
          })
          .filter((desc: string) => desc && desc.trim().length > 0);
        const situacoesStr = situacoesArr.join('; ');
        const etapasDetalhesArr: string[] = [];
        for (const e of etapas) {
          const desc = (e.descricao ?? '').replace(/"/g, '""');
          const entregavelObj = e.entregavel ?? e.entregavel_link_sei;
          const entregavel = entregavelObj ? String(entregavelObj.descricao ?? entregavelObj.entregavel_numero ?? '') : '';
          const numeroRef = e.numero_ref ?? '';
          const verif = e.status_verificacao ?? '';
          const dataPrev = e.data_verificacao_prevista ? e.data_verificacao_prevista.toISOString().split('T')[0] : '';
          const dataReal = e.data_verificacao_realizada ? e.data_verificacao_realizada.toISOString().split('T')[0] : '';
          etapasDetalhesArr.push(`${desc}|${entregavel}|${numeroRef}|${verif}|${dataPrev}|${dataReal}`);
        }
        const etapasDetalhes = etapasDetalhesArr.join(';;');

        const row = [
          eixo.numero,
          '"' + String(eixo.nome).replace(/"/g, '""') + '"',
          '"' + String(proj.codigo_projeto ?? '').replace(/"/g, '""') + '"',
          '"' + String(proj.nome_projeto ?? '').replace(/"/g, '""') + '"',
          temaNum,
          pri,
          '"' + String(responsavel).replace(/"/g, '""') + '"',
          '"' + String(colaboradores).replace(/"/g, '""') + '"',
          '"' + String(colaboradoresDetalhados).replace(/"/g, '""') + '"',
          '"' + String(situacoesStr).replace(/"/g, '""') + '"',
          '"' + String(oQue).replace(/"/g, '""') + '"',
          '"' + String(porQue).replace(/"/g, '""') + '"',
          '"' + String(objetivosRef).replace(/"/g, '""') + '"',
          proj.custo_total_estimado ?? '',
          '"' + String(proj.fonte_recursos ?? '').replace(/"/g, '""') + '"',
          proj.data_inicio ? proj.data_inicio.toISOString().split('T')[0] : '',
          proj.data_final ? proj.data_final.toISOString().split('T')[0] : '',
          etapas.length,
          entregaveisCount,
          '"' + String(etapasDetalhes).replace(/"/g, '""') + '"',
        ];

        csv += `${row.join(',')}\n`;
      }
    }

    return csv;
  }
}
