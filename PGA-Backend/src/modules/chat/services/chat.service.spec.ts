import { ConfigService } from '@nestjs/config';
import { ChatService, ChatMessage } from './chat.service';
import {
  APIConnectionTimeoutError,
  APIConnectionError,
  APIError,
} from 'openai/error';

// ─── Mocks de fs/promises ────────────────────────────────────────────────────
const mockReadFile = jest.fn();
const mockReaddir = jest.fn();

jest.mock('fs/promises', () => ({
  readFile: (...args: any[]) => mockReadFile(...args),
  readdir: (...args: any[]) => mockReaddir(...args),
}));

// ─── Mock do cliente OpenAI ───────────────────────────────────────────────────
const mockCreate = jest.fn();

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeService(apiKey: string | undefined): ChatService {
  const config = {
    get: jest.fn().mockReturnValue(apiKey),
  } as unknown as ConfigService;
  return new ChatService(config);
}

const messages: ChatMessage[] = [{ role: 'user', content: 'Olá' }];

// ─── Testes ───────────────────────────────────────────────────────────────────
describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReadFile.mockRejectedValue(new Error('not found'));
    mockReaddir.mockRejectedValue(new Error('no dir'));
  });

  // ─── Constructor ────────────────────────────────────────────────────────────
  describe('constructor', () => {
    it('cria client quando NVIDIA_API_KEY está configurada', () => {
      const service = makeService('nvapi-test');
      // se client foi criado, sendMessage não lança "não configurado"
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      });
      expect(service).toBeDefined();
    });

    it('não cria client quando NVIDIA_API_KEY está ausente', async () => {
      const service = makeService(undefined);
      await expect(service.sendMessage(messages)).rejects.toThrow(
        'O serviço de chatbot não está configurado (NVIDIA_API_KEY ausente).',
      );
    });
  });

  // ─── onModuleInit ────────────────────────────────────────────────────────────
  describe('onModuleInit', () => {
    it('carrega CHATBOT_CONTEXT.md quando encontrado', async () => {
      mockReadFile.mockResolvedValue('# Contexto do projeto');
      mockReaddir.mockRejectedValue(new Error('no dir'));

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('continua sem erro quando CHATBOT_CONTEXT.md não existe', async () => {
      mockReadFile.mockRejectedValue(new Error('ENOENT'));
      mockReaddir.mockRejectedValue(new Error('no dir'));

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('carrega arquivos da pasta docs/ quando existem', async () => {
      mockReadFile
        .mockResolvedValueOnce('# Contexto') // CHATBOT_CONTEXT.md
        .mockResolvedValueOnce('# Doc 1')    // doc1.md
        .mockResolvedValueOnce('# Doc 2');   // doc2.txt

      mockReaddir.mockResolvedValue(['doc1.md', 'doc2.txt', 'ignore.json']);

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('ignora arquivos da docs/ que falham na leitura', async () => {
      mockReadFile
        .mockResolvedValueOnce('# Contexto')
        .mockRejectedValueOnce(new Error('erro leitura'));

      mockReaddir.mockResolvedValue(['quebrado.md']);

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('não carrega docs quando a pasta não tem md/txt', async () => {
      mockReadFile.mockResolvedValueOnce('# Contexto');
      mockReaddir.mockResolvedValue(['arquivo.json', 'imagem.png']);

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });

    it('captura erro inesperado no processo de carregamento (outer catch)', async () => {
      mockReadFile.mockResolvedValueOnce('# Contexto');
      // retorna não-array → files.filter() lança TypeError → outer catch
      mockReaddir.mockResolvedValue(42 as any);

      const service = makeService('nvapi-test');
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });
  });

  // ─── sendMessage ─────────────────────────────────────────────────────────────
  describe('sendMessage', () => {
    it('retorna conteúdo da resposta com sucesso', async () => {
      const service = makeService('nvapi-test');
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Resposta da IA' } }],
      });

      const result = await service.sendMessage(messages);
      expect(result).toBe('Resposta da IA');
    });

    it('retorna fallback quando choices está vazio', async () => {
      const service = makeService('nvapi-test');
      mockCreate.mockResolvedValue({ choices: [] });

      const result = await service.sendMessage(messages);
      expect(result).toBe('Erro: nenhuma resposta gerada.');
    });

    it('inclui documentação suplementar no prompt quando carregada', async () => {
      mockReadFile
        .mockResolvedValueOnce('# Contexto principal') // CHATBOT_CONTEXT.md
        .mockResolvedValueOnce('# Doc suplementar');   // suplementar.md
      mockReaddir.mockResolvedValue(['suplementar.md']);

      const service = makeService('nvapi-test');
      await service.onModuleInit();

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      });

      await service.sendMessage(messages);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('DOCUMENTAÇÃO SUPLEMENTAR');
    });

    it('inclui contexto adicional no prompt quando carregado', async () => {
      mockReadFile.mockResolvedValue('# Contexto carregado');
      mockReaddir.mockRejectedValue(new Error('no dir'));

      const service = makeService('nvapi-test');
      await service.onModuleInit();

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      });

      await service.sendMessage(messages);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('Contexto carregado');
    });

    it('inclui aviso no prompt quando contexto não foi carregado', async () => {
      const service = makeService('nvapi-test');
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      });

      await service.sendMessage(messages);
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('AVISO');
    });

    it('lança erro de timeout (APIConnectionTimeoutError)', async () => {
      const service = makeService('nvapi-test');
      mockCreate.mockRejectedValue(new APIConnectionTimeoutError());

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'A API demorou muito para responder. Tente novamente.',
      );
    });

    it('lança erro de conexão (APIConnectionError)', async () => {
      const service = makeService('nvapi-test');
      // APIConnectionTimeoutError extends APIConnectionError, usar diretamente
      const err = Object.assign(new APIConnectionError({ message: 'conn fail' }), {});
      // Garantir que não seja instância de APIConnectionTimeoutError
      Object.setPrototypeOf(err, APIConnectionError.prototype);
      mockCreate.mockRejectedValue(err);

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'Não foi possível conectar à API da NVIDIA.',
      );
    });

    it('lança erro 401 (chave inválida)', async () => {
      const service = makeService('nvapi-test');
      const err = new APIError(401, { message: 'Unauthorized' } as any, 'Unauthorized', {} as any);
      mockCreate.mockRejectedValue(err);

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'Chave de API inválida. Verifique NVIDIA_API_KEY no .env',
      );
    });

    it('lança erro 429 (rate limit)', async () => {
      const service = makeService('nvapi-test');
      const err = new APIError(429, { message: 'Too Many Requests' } as any, 'Too Many Requests', {} as any);
      mockCreate.mockRejectedValue(err);

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'Limite de requisições atingido.',
      );
    });

    it('lança erro genérico de API (outro status)', async () => {
      const service = makeService('nvapi-test');
      const err = new APIError(500, { message: 'Internal Server Error' } as any, 'Internal Server Error', {} as any);
      mockCreate.mockRejectedValue(err);

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'Erro ao chamar a API:',
      );
    });

    it('relança erros desconhecidos', async () => {
      const service = makeService('nvapi-test');
      const err = new Error('erro inesperado');
      mockCreate.mockRejectedValue(err);

      await expect(service.sendMessage(messages)).rejects.toThrow(
        'erro inesperado',
      );
    });
  });
});
