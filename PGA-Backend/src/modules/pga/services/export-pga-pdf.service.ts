import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ExportPgaPdfService {
  constructor(private readonly repository: PgaRepository) {}

  private buildHtml(pga: any) {
    const unidadeNome = pga.unidade?.nome_unidade ?? '';
    const situacoes = pga.situacoesProblemas ?? [];

    const situacaoCountMap: Record<number, { descricao: string; count: number }> = {};
    const projetos = pga.acoesProjetos ?? [];
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

    let situacoesHtml = '';
    if (situacoesOrdenadas.length) {
      situacoesHtml += '<ol>';
      for (const s of situacoesOrdenadas) {
        situacoesHtml += `<li>${this.escapeHtml(String(s.descricao))} <small>(usos: ${s.count})</small></li>`;
      }
      situacoesHtml += '</ol>';
    }

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color:#222; font-size:12px }
            h1 { background:#2b6a3b; color:white; padding:10px; font-size:16px; margin:0 0 10px 0 }
            h2 { background:#4a8c5c; color:white; padding:6px 10px; font-size:13px; margin:20px 0 6px 0; page-break-before: auto }
            h3 { background:#d6e8dc; color:#1a4a2a; padding:5px 8px; font-size:12px; margin:14px 0 4px 0 }
            .meta { margin:8px 0 }
            .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin:8px 0 }
            table { width:100%; border-collapse:collapse; margin-top:6px; font-size:11px }
            th { background:#e8f4ea; border:1px solid #ccc; padding:5px 6px; text-align:left; font-size:11px }
            td { border:1px solid #ccc; padding:5px 6px }
            .cenario { white-space:pre-wrap; line-height:1.5; margin:6px 0 }
            .tag-urgente { background:#c0392b; color:#fff; padding:1px 5px; border-radius:3px; font-size:10px }
            .tag-alta { background:#e67e22; color:#fff; padding:1px 5px; border-radius:3px; font-size:10px }
            .tag-media { background:#3498db; color:#fff; padding:1px 5px; border-radius:3px; font-size:10px }
            .tag-regular { background:#7f8c8d; color:#fff; padding:1px 5px; border-radius:3px; font-size:10px }
            .page-break { page-break-before: always }
          </style>
        </head>
        <body>
          <h1>Plano de Gestão Anual – PGA ${this.escapeHtml(String(pga.ano ?? ''))}</h1>

          <div class="meta-grid">
            <div><strong>Unidade:</strong> ${this.escapeHtml(unidadeNome)}</div>
            <div><strong>Versão:</strong> ${this.escapeHtml(String(pga.versao ?? ''))}</div>
            <div><strong>Status:</strong> ${this.escapeHtml(String(pga.status ?? ''))}</div>
            <div><strong>Código:</strong> ${this.escapeHtml((pga as any).unidade?.codigo_fnnn ?? '')}</div>
          </div>

          <h2>Análise do Cenário</h2>
          <div class="cenario">${this.escapeHtml(String(pga.analise_cenario ?? ''))}</div>

          <h2>Apontamento de Situações-Problema Mais Relevantes</h2>
          ${situacoesHtml}

          <h2>Estruturação das Ações/Projetos</h2>
          ${this.buildProjetosHtml(projetos)}

          <div class="page-break"></div>
          <h2>Rotinas Institucionais</h2>
          ${this.buildRotinasHtml(pga.rotinas ?? [])}

          <div class="page-break"></div>
          <h2>Anexo 6 – Lista de Ações/Projetos referentes à CPA</h2>
          ${this.buildAcoesCpaHtml(pga.acoesCPA ?? [])}

          <div class="page-break"></div>
          <h2>Anexos 1–5 – Lista de Aquisições Necessárias aos Projetos</h2>
          ${this.buildAnexosHtml(projetos)}
        </body>
      </html>
    `;

    return html;
  }

  private buildProjetosHtml(projetos: any[]) {
    if (!projetos || !projetos.length) return '<p>Nenhum projeto cadastrado neste PGA.</p>';

    const eixoMap: Record<number, { nome: string; projetos: any[] }> = {};
    for (const proj of projetos) {
      const eixo = proj.eixo ?? { numero: 0, nome_eixo: '' };
      const num = eixo.numero ?? 0;
      if (!eixoMap[num]) eixoMap[num] = { nome: eixo.nome_eixo ?? '', projetos: [] };
      eixoMap[num].projetos.push(proj);
    }

    const eixos = Object.keys(eixoMap).map((k) => ({ numero: Number(k), nome: eixoMap[Number(k)].nome, projetos: eixoMap[Number(k)].projetos })).sort((a, b) => a.numero - b.numero);

    let html = '';
    for (const eixo of eixos) {
      html += `<h3>${String(eixo.numero).padStart(2, '0')} - ${this.escapeHtml(String(eixo.nome))}</h3>`;

      eixo.projetos.sort((a: any, b: any) => {
        const pa = parseInt(String(a.codigo_projeto || '').trim().split(/[^0-9]/)[0] || '0', 10);
        const pb = parseInt(String(b.codigo_projeto || '').trim().split(/[^0-9]/)[0] || '0', 10);
        return pa - pb;
      });

      for (const proj of eixo.projetos) {
        const codigo = this.escapeHtml(String(proj.codigo_projeto ?? ''));
        const nome = this.escapeHtml(String(proj.nome_projeto ?? ''));
        const tema = proj.tema ? `${proj.tema.tema_num} - ${this.escapeHtml(String(proj.tema.descricao ?? ''))}` : '';
        const prioridade = proj.prioridade ? `${proj.prioridade.grau} - ${this.escapeHtml(String(proj.prioridade.descricao ?? ''))}` : '';
        const pessoas = proj.pessoas ?? [];
        const respObj = pessoas.find((pp: any) => pp.papel === 'Responsavel');
        const responsavelNome = respObj?.pessoa?.nome ?? '';
        const responsavelCH = respObj?.carga_horaria_semanal ?? '';
        const responsavelTipo = respObj?.tipo_vinculo_hae ? this.escapeHtml(String(respObj.tipo_vinculo_hae.sigla ?? respObj.tipo_vinculo_hae.descricao ?? '')) : '';

        const colaboradoresArr = pessoas.filter((pp: any) => pp.papel !== 'Responsavel').map((pp: any) => ({
          nome: pp.pessoa?.nome ?? '',
          ch: pp.carga_horaria_semanal ?? '',
          tipo: pp.tipo_vinculo_hae ? (pp.tipo_vinculo_hae.sigla ?? pp.tipo_vinculo_hae.descricao ?? '') : '',
        }));

        const oQue = this.escapeHtml(String(proj.o_que_sera_feito ?? ''));
        const porQue = this.escapeHtml(String(proj.por_que_sera_feito ?? ''));
        const objetivosRef = this.escapeHtml(String(proj.objetivos_institucionais_referenciados ?? ''));
        const fonteRec = this.escapeHtml(String(proj.fonte_recursos ?? ''));

        const situacoesProjArr = (proj.situacoesProblemas ?? [])
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
        const situacoesProj = situacoesProjArr.join('; ');

        const formatDate = (d: any) => {
          if (!d) return '';
          const dt = d instanceof Date ? d : new Date(d);
          if (Number.isNaN(dt.getTime())) return '';
          return dt.toISOString().split('T')[0];
        };

        const dataInicio = formatDate(proj.data_inicio);
        const dataFinal = formatDate(proj.data_final);
        const custo = proj.custo_total_estimado ? String(proj.custo_total_estimado) : '';

        html += `<table style="width:100%;border:1px solid #bbb;margin-top:8px;border-collapse:collapse"><tbody>`;
        html += `<tr style="background:#eee"><th style="width:35%;padding:6px;border:1px solid #ccc;text-align:left">AÇÃO/PROJETO (Tema)</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${codigo} - ${nome} ${tema ? ` - ${this.escapeHtml(tema)}` : ''}</td></tr>`;
        html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Origem (prioridade):</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${this.escapeHtml(prioridade)}</td></tr>`;

        if (objetivosRef) html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Referente ao(s) projeto(s):</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${objetivosRef}</td></tr>`;
        if (oQue) html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">O que será feito:</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${oQue}</td></tr>`;
        if (porQue) html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Por que será feito:</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${porQue}</td></tr>`;

        html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Responsável:</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${this.escapeHtml(responsavelNome)}${responsavelCH ? ` (CH/sem: ${responsavelCH})` : ''}${responsavelTipo ? ` (Tipo: ${responsavelTipo})` : ''}</td></tr>`;

        if (colaboradoresArr.length) {
          for (const col of colaboradoresArr) {
            html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Colaborador(a):</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${this.escapeHtml(col.nome)}${col.ch ? ` (CH/sem: ${col.ch})` : ''}${col.tipo ? ` (Tipo: ${this.escapeHtml(col.tipo)})` : ''}</td></tr>`;
          }
        } else {
          html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Colaborador(a)</th><td colspan="3" style="padding:6px;border:1px solid #ccc">-</td></tr>`;
        }

        html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Período de execução:</th><td style="padding:6px;border:1px solid #ccc;white-space:nowrap"><b>Data inicial:</b> ${dataInicio}</td><td style="padding:6px;border:1px solid #ccc;white-space:nowrap"><b>Data final:</b> ${dataFinal}</td><td style="padding:6px;border:1px solid #ccc">&nbsp;</td></tr>`;

        const etapas = proj.etapas ?? [];
        html += `<tr><td colspan="4" style="padding:6px;border:1px solid #ccc"><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#f6f6f6"><th style="border:1px solid #ddd;padding:6px;width:5%">#</th><th style="border:1px solid #ddd;padding:6px;width:40%">Atividade</th><th style="border:1px solid #ddd;padding:6px;width:25%">Entregável</th><th style="border:1px solid #ddd;padding:6px;width:10%">Nº Ref</th><th style="border:1px solid #ddd;padding:6px;width:10%">Verificação</th><th style="border:1px solid #ddd;padding:6px;width:10%">Data</th></tr></thead><tbody>`;

        if (etapas.length) {
          let idx = 1;
          for (const e of etapas) {
            const desc = this.escapeHtml(String(e.descricao ?? ''));
            const entregavelObj = e.entregavel ?? e.entregavel_link_sei;
            const entregavel = entregavelObj ? this.escapeHtml(String(entregavelObj.descricao ?? entregavelObj.entregavel_numero ?? '')) : '';
            const numeroRef = this.escapeHtml(String(e.numero_ref ?? ''));
            const verif = e.status_verificacao ?? '';
            const dataPrev = e.data_verificacao_prevista ? (new Date(e.data_verificacao_prevista)).toISOString().split('T')[0] : '';
            const dataReal = e.data_verificacao_realizada ? (new Date(e.data_verificacao_realizada)).toISOString().split('T')[0] : '';
            const dataStr = dataReal || dataPrev || '';
            html += `<tr><td style="border:1px solid #eee;padding:6px;text-align:center">${String(idx).padStart(2,'0')}</td><td style="border:1px solid #eee;padding:6px">${desc}</td><td style="border:1px solid #eee;padding:6px">${entregavel}</td><td style="border:1px solid #eee;padding:6px;text-align:center">${numeroRef}</td><td style="border:1px solid #eee;padding:6px;text-align:center">${this.escapeHtml(String(verif ?? ''))}</td><td style="border:1px solid #eee;padding:6px;text-align:center">${dataStr}</td></tr>`;
            idx += 1;
          }
        } else {
          for (let i = 1; i <= 8; i++) {
            html += `<tr><td style="border:1px solid #eee;padding:6px;text-align:center">${String(i).padStart(2,'0')}</td><td style="border:1px solid #eee;padding:6px">&nbsp;</td><td style="border:1px solid #eee;padding:6px">&nbsp;</td><td style="border:1px solid #eee;padding:6px">&nbsp;</td><td style="border:1px solid #eee;padding:6px">&nbsp;</td><td style="border:1px solid #eee;padding:6px">&nbsp;</td></tr>`;
          }
        }

        html += `</tbody></table></td></tr>`;

        html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Custo R$ (se houver):</th><td style="padding:6px;border:1px solid #ccc">${custo}</td><th style="padding:6px;border:1px solid #ccc;text-align:left">Fonte(s) dos recursos</th><td style="padding:6px;border:1px solid #ccc">${fonteRec}</td></tr>`;
        if (situacoesProj) html += `<tr><th style="padding:6px;border:1px solid #ccc;text-align:left">Situação(s) problema:</th><td colspan="3" style="padding:6px;border:1px solid #ccc">${this.escapeHtml(situacoesProj)}</td></tr>`;

        html += `</tbody></table>`;
      }
    }

    return html;
  }

  private buildRotinasHtml(rotinas: any[]): string {
    if (!rotinas || !rotinas.length) return '<p>Nenhuma rotina institucional cadastrada neste PGA.</p>';

    const tipoLabel: Record<string, string> = {
      CPA: 'CPA – Comissão Própria de Avaliação',
      CEPE: 'CEPE – Conselho de Ensino, Pesquisa e Extensão',
      NDE: 'NDE – Núcleo Docente Estruturante',
      ReuniaoPedagogica: 'Reunião Pedagógica',
      Planejamento: 'Planejamento',
      AvaliacaoInstitucional: 'Avaliação Institucional',
      AcompanhamentoAcademico: 'Acompanhamento Acadêmico',
      Outro: 'Outro',
    };

    const formatDate = (d: any) => {
      if (!d) return '';
      const dt = d instanceof Date ? d : new Date(d);
      if (isNaN(dt.getTime())) return '';
      return dt.toISOString().split('T')[0];
    };

    const formatTime = (d: any) => {
      if (!d) return '';
      const dt = d instanceof Date ? d : new Date(d);
      if (isNaN(dt.getTime())) return '';
      return dt.toTimeString().slice(0, 5);
    };

    let html = '';
    for (const rotina of rotinas) {
      const tipo = tipoLabel[rotina.tipo_rotina] ?? rotina.tipo_rotina ?? '';
      const titulo = this.escapeHtml(String(rotina.titulo ?? ''));
      const curso = rotina.curso?.nome ? ` (${this.escapeHtml(String(rotina.curso.nome))})` : '';
      const responsavel = this.escapeHtml(String(rotina.responsavel?.nome ?? ''));
      const periodicidade = this.escapeHtml(String(rotina.periodicidade ?? ''));
      const status = this.escapeHtml(String(rotina.status ?? ''));
      const dataInicio = formatDate(rotina.data_inicio);
      const dataFim = formatDate(rotina.data_fim);
      const entregavel = this.escapeHtml(String(rotina.entregavel_esperado ?? ''));
      const participantes = (rotina.participantes ?? [])
        .map((p: any) => `${this.escapeHtml(String(p.pessoa?.nome ?? ''))}${p.papel ? ` (${this.escapeHtml(String(p.papel))})` : ''}`)
        .join(', ');

      html += `<table style="width:100%;border:1px solid #bbb;margin-top:10px;border-collapse:collapse"><tbody>`;
      html += `<tr style="background:#d6e8dc"><th colspan="4" style="padding:6px;border:1px solid #ccc;text-align:left">${tipo}${curso} – ${titulo}</th></tr>`;
      html += `<tr><th style="width:20%;padding:5px;border:1px solid #ccc">Responsável</th><td style="padding:5px;border:1px solid #ccc">${responsavel}</td><th style="width:20%;padding:5px;border:1px solid #ccc">Periodicidade</th><td style="padding:5px;border:1px solid #ccc">${periodicidade}</td></tr>`;
      html += `<tr><th style="padding:5px;border:1px solid #ccc">Período</th><td style="padding:5px;border:1px solid #ccc">${dataInicio} a ${dataFim}</td><th style="padding:5px;border:1px solid #ccc">Status</th><td style="padding:5px;border:1px solid #ccc">${status}</td></tr>`;
      if (entregavel) html += `<tr><th style="padding:5px;border:1px solid #ccc">Entregável Esperado</th><td colspan="3" style="padding:5px;border:1px solid #ccc">${entregavel}</td></tr>`;
      if (participantes) html += `<tr><th style="padding:5px;border:1px solid #ccc">Participantes</th><td colspan="3" style="padding:5px;border:1px solid #ccc">${participantes}</td></tr>`;

      const ocorrencias = rotina.ocorrencias ?? [];
      if (ocorrencias.length) {
        html += `<tr><td colspan="4" style="padding:5px;border:1px solid #ccc">`;
        html += `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#f0f0f0">`;
        html += `<th style="border:1px solid #ddd;padding:4px;width:14%">Data</th>`;
        html += `<th style="border:1px solid #ddd;padding:4px;width:10%">Início</th>`;
        html += `<th style="border:1px solid #ddd;padding:4px;width:10%">Fim</th>`;
        html += `<th style="border:1px solid #ddd;padding:4px;width:20%">Local</th>`;
        html += `<th style="border:1px solid #ddd;padding:4px">Pauta</th>`;
        html += `<th style="border:1px solid #ddd;padding:4px;width:12%">Status</th>`;
        html += `</tr></thead><tbody>`;
        for (const oc of ocorrencias) {
          html += `<tr>`;
          html += `<td style="border:1px solid #eee;padding:4px;text-align:center">${formatDate(oc.data_realizacao)}</td>`;
          html += `<td style="border:1px solid #eee;padding:4px;text-align:center">${formatTime(oc.hora_inicio)}</td>`;
          html += `<td style="border:1px solid #eee;padding:4px;text-align:center">${formatTime(oc.hora_fim)}</td>`;
          html += `<td style="border:1px solid #eee;padding:4px">${this.escapeHtml(String(oc.local ?? ''))}</td>`;
          html += `<td style="border:1px solid #eee;padding:4px">${this.escapeHtml(String(oc.pauta ?? ''))}</td>`;
          html += `<td style="border:1px solid #eee;padding:4px;text-align:center">${this.escapeHtml(String(oc.status ?? ''))}</td>`;
          html += `</tr>`;
        }
        html += `</tbody></table></td></tr>`;
      }
      html += `</tbody></table>`;
    }
    return html;
  }

  private buildAcoesCpaHtml(acoesCPA: any[]): string {
    if (!acoesCPA || !acoesCPA.length) return '<p>Nenhuma ação CPA cadastrada neste PGA.</p>';

    let html = `<table style="width:100%;border-collapse:collapse;margin-top:8px">`;
    html += `<thead><tr style="background:#e8f4ea">`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:5%">Item</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:60%">Denominação (O que será feito)</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px">Justificativa</th>`;
    html += `</tr></thead><tbody>`;

    acoesCPA.forEach((acao, idx) => {
      const rowBg = idx % 2 === 0 ? '' : 'style="background:#f9f9f9"';
      html += `<tr ${rowBg}>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:center">${String(idx + 1).padStart(2, '0')}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px">${this.escapeHtml(String(acao.descricao ?? ''))}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px">${this.escapeHtml(String(acao.justificativa ?? ''))}</td>`;
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    return html;
  }

  private buildAnexosHtml(projetos: any[]): string {
    const allAnexos: { codigo: string; item: string; descricao: string; quantidade: number; precoUnit: string; precoTotal: string }[] = [];

    for (const proj of projetos) {
      const codigo = proj.codigo_projeto ?? '';
      for (const etapa of proj.etapas ?? []) {
        for (const anexo of etapa.anexos ?? []) {
          allAnexos.push({
            codigo,
            item: String(anexo.item ?? ''),
            descricao: String(anexo.descricao ?? ''),
            quantidade: Number(anexo.quantidade ?? 0),
            precoUnit: anexo.preco_unitario_estimado != null ? Number(anexo.preco_unitario_estimado).toFixed(2) : '0,00',
            precoTotal: anexo.preco_total_estimado != null ? Number(anexo.preco_total_estimado).toFixed(2) : '0,00',
          });
        }
      }
    }

    if (!allAnexos.length) return '<p>Nenhum item de aquisição cadastrado neste PGA.</p>';

    const total = allAnexos.reduce((sum, a) => sum + Number(a.precoTotal.replace(',', '.')), 0);

    let html = `<table style="width:100%;border-collapse:collapse;margin-top:8px">`;
    html += `<thead><tr style="background:#e8f4ea">`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:5%">Item</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:8%">Projeto</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:20%">Denominação / Especificação</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:35%">Descrição</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:7%">Qtd.</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:12%">Preço Unit. (R$)</th>`;
    html += `<th style="border:1px solid #ccc;padding:6px;width:13%">Preço Total (R$)</th>`;
    html += `</tr></thead><tbody>`;

    allAnexos.forEach((a, idx) => {
      const rowBg = idx % 2 === 0 ? '' : 'style="background:#f9f9f9"';
      html += `<tr ${rowBg}>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:center">${String(idx + 1).padStart(2, '0')}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:center">${this.escapeHtml(a.codigo)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px">${this.escapeHtml(a.item)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px">${this.escapeHtml(a.descricao)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:center">${a.quantidade}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:right">${a.precoUnit}</td>`;
      html += `<td style="border:1px solid #ccc;padding:6px;text-align:right">${a.precoTotal}</td>`;
      html += `</tr>`;
    });

    html += `<tr style="background:#e8f4ea;font-weight:bold">`;
    html += `<td colspan="6" style="border:1px solid #ccc;padding:6px;text-align:right">Total Geral (R$)</td>`;
    html += `<td style="border:1px solid #ccc;padding:6px;text-align:right">${total.toFixed(2)}</td>`;
    html += `</tr>`;
    html += `</tbody></table>`;
    return html;
  }

  private escapeHtml(input: string) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async execute(id: number, user?: any): Promise<Buffer> {
    const active = user?.active_context ?? null;
    const hasAccess = await this.repository.findOneWithContext(id, active);
    if (!hasAccess) throw new NotFoundException('PGA não encontrada ou sem acesso');

    const pga = await this.repository.findOneWithRelations(id);
    if (!pga) throw new NotFoundException('PGA não encontrada após carregamento de relações');

    console.log('[ExportPgaPdfService] PGA carregado:', JSON.stringify({
      pga_id: pga.pga_id,
      projetos_count: pga.acoesProjetos?.length ?? 0,
      projetos_situacoes: pga.acoesProjetos?.map((p: any) => ({
        codigo: p.codigo_projeto,
        situacoes_count: p.situacoesProblemas?.length ?? 0
      }))
    }, null, 2));

    const html = this.buildHtml(pga);

    let browser: puppeteer.Browser | null = null;
    try {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      return Buffer.from(pdfBuffer);
    } catch (err: any) {
      console.error('Erro ao gerar PDF do PGA:', err?.stack ?? err?.message ?? err);
      throw new InternalServerErrorException('Erro ao gerar PDF do PGA');
    } finally {
      try {
        if (browser) await browser.close();
      } catch (closeErr) {
        console.error('Erro ao fechar o browser do Puppeteer:', closeErr);
      }
    }
  }
}
