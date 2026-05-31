import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly model = 'nvidia/nemotron-mini-4b-instruct';
  private chatbotContext = '';
  private additionalDocs = '';
  private client?: OpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('NVIDIA_API_KEY');
    if (!key) {
      this.logger.warn(
        '⚠️ NVIDIA_API_KEY não configurada em .env. O Chatbot não funcionará.',
      );
    } else {
      this.client = new OpenAI({
        apiKey: key,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        timeout: 90000,
      });
    }
  }

  async onModuleInit() {
    try {
      const contextPath = join(process.cwd(), 'CHATBOT_CONTEXT.md');
      try {
        this.chatbotContext = await readFile(contextPath, 'utf-8');
        this.logger.log('CHATBOT_CONTEXT.md carregado com sucesso');
      } catch {
        this.logger.warn(
          `CHATBOT_CONTEXT.md não encontrado em ${contextPath}. Crie o arquivo para melhor funcionamento.`,
        );
      }

      const docsDir = join(process.cwd(), 'docs');
      const files = await readdir(docsDir).catch(() => {
        this.logger.debug('Pasta "docs/" não encontrada no root.');
        return [];
      });

      const mdAndTxt = files.filter(
        (f) => f.endsWith('.md') || f.endsWith('.txt'),
      );

      if (mdAndTxt.length > 0) {
        const contents = await Promise.all(
          mdAndTxt.map(async (f) => {
            try {
              const text = await readFile(join(docsDir, f), 'utf-8');
              return `### Arquivo: ${f}\n${text}`;
            } catch (err) {
              this.logger.error(`Erro ao ler arquivo ${f}: ${err}`);
              return '';
            }
          }),
        );
        this.additionalDocs = contents.filter(Boolean).join('\n\n---\n\n');
        this.logger.log(
          `Documentação suplementar carregada: ${mdAndTxt.length} arquivo(s)`,
        );
      }
    } catch (error) {
      this.logger.error('Falha ao carregar contextos de documentação', error);
    }
  }

  private buildSystemPrompt(): string {
    const baseRules = `Você é um assistente que tira dúvidas EXCLUSIVAMENTE sobre o projeto.

REGRAS CRÍTICAS:
- Responda APENAS com base no CONTEXTO E DOCUMENTAÇÃO fornecidos abaixo.
- Se a resposta não estiver nos documentos, responda: "Isso não está coberto na documentação do projeto."
- Nunca invente, complete ou use conhecimento externo.
- Se a pergunta não tiver relação com o projeto, recuse educadamente.
- Responda em português, de forma clara e objetiva.
- Se possível, mencione em qual seção/arquivo encontrou a resposta.`;

    let fullContext = baseRules;

    if (this.chatbotContext) {
      fullContext +=
        '\n\n=== CONTEXTO PRINCIPAL DO PROJETO ===\n' + this.chatbotContext;
    } else {
      fullContext +=
        '\n\n⚠️ AVISO: Contexto principal (CHATBOT_CONTEXT.md) não foi carregado.';
    }

    if (this.additionalDocs) {
      fullContext +=
        '\n\n=== DOCUMENTAÇÃO SUPLEMENTAR ===\n' + this.additionalDocs;
    }

    return fullContext;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.client) {
      throw new Error(
        'O serviço de chatbot não está configurado (NVIDIA_API_KEY ausente).',
      );
    }

    this.logger.log(
      `[sendMessage] Chamada recebida com ${messages.length} mensagens.`,
    );

    try {
      this.logger.log(`[sendMessage] Enviando para Nemotron (${this.model})...`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completion = await (this.client.chat.completions.create as any)({
        model: this.model,
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          ...messages,
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
        stream: false,
      });

      this.logger.log('[sendMessage] Resposta recebida com sucesso.');

      return completion.choices[0]?.message?.content || 'Erro: nenhuma resposta gerada.';
    } catch (error) {
      this.logger.error('[sendMessage] Erro ao chamar a API.');

      if (error instanceof OpenAI.APITimeoutError) {
        this.logger.error('Timeout ao chamar a API da NVIDIA');
        throw new Error('A API demorou muito para responder. Tente novamente.');
      }

      if (error instanceof OpenAI.APIConnectionError) {
        this.logger.error('Erro de conexão com a API da NVIDIA');
        throw new Error(
          'Não foi possível conectar à API da NVIDIA. Verifique sua conexão.',
        );
      }

      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          this.logger.error('Chave NVIDIA_API_KEY inválida ou expirada');
          throw new Error('Chave de API inválida. Verifique NVIDIA_API_KEY no .env');
        }
        if (error.status === 429) {
          this.logger.warn('Rate limit atingido');
          throw new Error(
            'Limite de requisições atingido. Aguarde um momento e tente novamente.',
          );
        }
        this.logger.error(`Erro API [${error.status}]: ${error.message}`);
        throw new Error(`Erro ao chamar a API: ${error.message}`);
      }

      throw error;
    }
  }
}
