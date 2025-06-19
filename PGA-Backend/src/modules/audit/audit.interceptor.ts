import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler,
  Logger 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from './services/audit-log.service';
import { TipoOperacaoAuditoria } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, user } = request;
    
    // Determinar a operação baseada no método HTTP
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
        return next.handle(); // Não auditar GET
    }

    // Extrair informações da URL
    const auditInfo = this.extractAuditInfo(url);
    if (!auditInfo) {
      return next.handle(); // Não auditar se não conseguir extrair info
    }

    const startTime = Date.now();
    this.logger.debug(`🔍 Auditando: ${method} ${url} - Tabela: ${auditInfo.tabela}`);

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Usar o método existente createLog do AuditLogService
          await this.auditLogService.createLog({
            tabela: auditInfo.tabela,
            registro_id: auditInfo.registroId || response?.id || this.extractIdFromResponse(response, auditInfo.tabela),
            ano: new Date().getFullYear(),
            operacao,
            dados_antes: null, // Por enquanto null, pode ser implementado depois
            dados_depois: operacao !== TipoOperacaoAuditoria.DELETE ? response : null,
            usuario_id: user?.pessoa_id || user?.id || null,
            motivo: body?.motivo || null,
          });

          this.logger.log(`✅ Auditoria registrada: ${auditInfo.tabela}.${operacao} em ${duration}ms`);

        } catch (error) {
          this.logger.error(`❌ Erro ao registrar auditoria: ${error.message}`, error.stack);
        }
      }),
      catchError((error) => {
        this.logger.error(`💥 Erro na operação auditada: ${method} ${url}`, error.stack);
        throw error;
      })
    );
  }

  private extractAuditInfo(url: string): { tabela: string; registroId?: number } | null {
    // Mapear URLs para nomes de tabelas baseado nas rotas existentes
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
      { pattern: /\/users/, tabela: 'pessoa' },
      { pattern: /\/pessoas/, tabela: 'pessoa' },
      { pattern: /\/pga/, tabela: 'pga' },
    ];

    // Encontrar a tabela correspondente
    const mapping = urlMappings.find(m => m.pattern.test(url));
    if (!mapping) return null;

    // Extrair ID do registro (para UPDATE e DELETE)
    let registroId: number | undefined;
    const idMatch = url.match(/\/(\d+)(?:\/|$)/);
    if (idMatch) {
      registroId = parseInt(idMatch[1], 10);
    }

    return {
      tabela: mapping.tabela,
      registroId
    };
  }

  private extractIdFromResponse(response: any, tabela: string): number | null {
    if (!response) return null;
    
    // Tentar diferentes padrões de ID baseados na tabela
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
    ];

    return possibleIds.find(id => id !== undefined && id !== null) || null;
  }
}