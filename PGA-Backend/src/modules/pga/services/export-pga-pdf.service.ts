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
            body { font-family: Arial, sans-serif; padding: 20px; color:#222 }
            h1 { background:#2b6a3b; color:white; padding:10px }
            .meta { margin:10px 0 }
            table { width:100%; border-collapse:collapse; margin-top:10px }
            th, td { border:1px solid #ccc; padding:8px; text-align:left }
          </style>
        </head>
        <body>
          <h1>Plano de Gestão Anual - PGA ${this.escapeHtml(String(pga.ano ?? ''))}</h1>
          <div class="meta">
            <strong>Unidade:</strong> ${this.escapeHtml(unidadeNome)}<br/>
            <strong>Versão:</strong> ${this.escapeHtml(String(pga.versao ?? ''))}
          </div>

          <h2>Análise do cenário</h2>
          <div>${this.escapeHtml(String(pga.analise_cenario ?? ''))}</div>

          <h2>Situações-problema mais relevantes</h2>
          ${situacoesHtml}

          <h2>Estruturação das Ações/Projetos</h2>
          <!-- Group projects by eixo and list projects ordered by codigo -->
          ${this.buildProjetosHtml(projetos)}
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
      html += '<table><thead><tr><th>Código</th><th>Projeto</th><th>Tema</th><th>Prioridade</th><th>Responsável</th><th>Colaboradores</th><th>Início</th><th>Fim</th><th>Custo</th></tr></thead><tbody>';

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
        const responsavel = pessoas.find((pp: any) => pp.papel === 'Responsavel')?.pessoa?.nome ?? '';
        const colaboradores = pessoas.filter((pp: any) => pp.papel !== 'Responsavel').map((pp: any) => pp.pessoa?.nome).filter(Boolean).join(', ');
        const formatDate = (d: any) => {
          if (!d) return '';
          const dt = d instanceof Date ? d : new Date(d);
          if (Number.isNaN(dt.getTime())) return '';
          return dt.toISOString().split('T')[0];
        };

        const dataInicio = formatDate(proj.data_inicio);
        const dataFinal = formatDate(proj.data_final);
        const custo = proj.custo_total_estimado ? String(proj.custo_total_estimado) : '';

        html += `<tr><td>${codigo}</td><td>${nome}</td><td>${tema}</td><td>${prioridade}</td><td>${this.escapeHtml(responsavel)}</td><td>${this.escapeHtml(colaboradores)}</td><td>${dataInicio}</td><td>${dataFinal}</td><td>${custo}</td></tr>`;

        const etapas = proj.etapas ?? [];
        if (etapas.length) {
          html += `<tr><td colspan="9"><strong>Etapas:</strong><table style="width:100%;border:0;margin-top:4px"><thead><tr><th>Etapa</th><th>Entregável</th><th>Anexos</th><th>Verificação</th></tr></thead><tbody>`;
          for (const e of etapas) {
            const desc = this.escapeHtml(String(e.descricao ?? ''));
            const entregavelObj = e.entregavel ?? e.entregavel_link_sei;
            const entregavel = entregavelObj ? this.escapeHtml(String(entregavelObj.descricao ?? entregavelObj.entregavel_numero ?? '')) : '';
            const anexos = (e.anexos ?? []).map((a: any) => this.escapeHtml(String(a.descricao ?? ''))).join(', ');
            const verif = e.status_verificacao ?? '';
            html += `<tr><td style="width:25%">${desc}</td><td style="width:35%">${entregavel}</td><td style="width:25%">${anexos}</td><td style="width:15%">${this.escapeHtml(verif)}</td></tr>`;
          }
          html += '</tbody></table></td></tr>';
        }
      }

      html += '</tbody></table>';
    }

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
