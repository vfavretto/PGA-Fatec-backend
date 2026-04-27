import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from './services/audit-log.service';
import { TipoOperacaoAuditoria } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}
  private readonly logger = new Logger(AuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, user } = request;

    let operacao: TipoOperacaoAuditoria;
    switch (method) {
      case 'POST':
        operacao = TipoOperacaoAuditoria.CREATE;
        break;
      case 'PUT':
      case 'PATCH':
        operacao = TipoOperacaoAuditoria.UPDATE;
        break;
      case 'DELETE':
        operacao = TipoOperacaoAuditoria.DELETE;
        break;
      default:
        return next.handle();
    }

    const auditInfo = this.extractAuditInfo(url);
    if (!auditInfo) {
      return next.handle();
    }

    const startTime = Date.now();
    this.logger.debug(
      `🔍 Auditando: ${method} ${url} - Tabela: ${auditInfo.tabela}`,
    );

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const endTime = Date.now();
          const duration = endTime - startTime;

          const registroId =
            auditInfo.registroId ||
            this.extractIdFromResponse(response, auditInfo.tabela);

          if (!registroId) {
            // Registrar como debug para evitar poluição de logs em operações sem id recuperável
            this.logger.debug(
              `⚠️ Não foi possível extrair registro_id para ${auditInfo.tabela}`,
            );
            return;
          }

          await this.auditLogService.createLog({
            tabela: auditInfo.tabela,
            registro_id: registroId,
            ano: new Date().getFullYear(),
            operacao,
            dados_antes: null,
            dados_depois:
              operacao !== TipoOperacaoAuditoria.DELETE ? response : null,
            usuario_id: user?.pessoa_id || user?.id || null,
            motivo: body?.motivo || null,
          });

          this.logger.log(
            `✅ Auditoria registrada: ${auditInfo.tabela}.${operacao} (ID: ${registroId}) em ${duration}ms`,
          );
        } catch (error) {
          this.logger.error(
            `❌ Erro ao registrar auditoria: ${error.message}`,
            error.stack,
          );
        }
      }),
      catchError((error) => {
        this.logger.error(
          `💥 Erro na operação auditada: ${method} ${url}`,
          error.stack,
        );
        throw error;
      }),
    );
  }

  private extractAuditInfo(
    url: string,
  ): { tabela: string; registroId?: string } | null {
    const urlMappings = [
      { pattern: /\/thematic-axis/, tabela: 'eixo_tematico' },
      { pattern: /\/eixos-tematicos/, tabela: 'eixo_tematico' },
      { pattern: /\/problem-situation/, tabela: 'situacao_problema' },
      { pattern: /\/situacoes-problema/, tabela: 'situacao_problema' },
      { pattern: /\/priority-action/, tabela: 'prioridade_acao' },
      { pattern: /\/prioridades/, tabela: 'prioridade_acao' },
      { pattern: /\/themes/, tabela: 'tema' },
      { pattern: /\/temas/, tabela: 'tema' },
      { pattern: /\/deliverable/, tabela: 'entregavel_link_sei' },
      { pattern: /\/entregaveis/, tabela: 'entregavel_link_sei' },
      { pattern: /\/users\/request-access/, tabela: 'solicitacao_acesso' },
      { pattern: /\/users/, tabela: 'pessoa' },
      { pattern: /\/pessoas/, tabela: 'pessoa' },
      { pattern: /\/pga/, tabela: 'pga' },
    ];

    const mapping = urlMappings.find((m) => m.pattern.test(url));
    if (!mapping) return null;

    let registroId: string | undefined;
    const idMatch = url.match(/\/([0-9a-f-]{8,})(?:\/|$)/);
    if (idMatch) {
      registroId = idMatch[1];
    }

    return { tabela: mapping.tabela, registroId };
  }

  private extractIdFromResponse(response: any, tabela: string): string | null {
    if (!response) return null;

    const possibleIds = [
      response.id,
      response[`${tabela}_id`],
      response.situacao_id,
      response.eixo_id,
      response.prioridade_id,
      response.tema_id,
      response.entregavel_id,
      response.pessoa_id,
      response.pga_id,
      response.solicitacao_id,
      response.data?.id,
      response.data?.[`${tabela}_id`],
      response.data?.solicitacao_id,
      response.data?.situacao_id,
      response.data?.eixo_id,
      response.data?.prioridade_id,
      response.data?.tema_id,
      response.data?.entregavel_id,
      response.data?.pessoa_id,
      response.data?.pga_id,
    ];

    return possibleIds.find((id) => id !== undefined && id !== null) || null;
  }
}
