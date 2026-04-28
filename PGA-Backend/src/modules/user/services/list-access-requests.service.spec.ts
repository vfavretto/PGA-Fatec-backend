import { ForbiddenException } from '@nestjs/common';
import { ListAccessRequestsService } from './list-access-requests.service';

const mockPrisma = {
  solicitacaoAcesso: { findMany: jest.fn() },
  pessoaUnidade: { findMany: jest.fn() },
};

describe('ListAccessRequestsService', () => {
  let service: ListAccessRequestsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ListAccessRequestsService(mockPrisma as any);
  });

  it('deve retornar solicitações para Administrador', async () => {
    mockPrisma.solicitacaoAcesso.findMany.mockResolvedValue([
      { status: 'Pendente' },
      { status: 'Aprovada' },
    ]);
    const result = await service.execute(1, 'Administrador' as any);
    expect(result.pendingRequests).toHaveLength(1);
    expect(result.processedRequests).toHaveLength(1);
  });

  it('deve retornar vazio para Diretor sem unidades', async () => {
    mockPrisma.pessoaUnidade.findMany.mockResolvedValue([]);
    const result = await service.execute(1, 'Diretor' as any);
    expect(result.pendingRequests).toHaveLength(0);
    expect(result.processedRequests).toHaveLength(0);
  });

  it('deve retornar solicitações para Diretor com unidades', async () => {
    mockPrisma.pessoaUnidade.findMany.mockResolvedValue([{ unidade_id: 5 }]);
    mockPrisma.solicitacaoAcesso.findMany.mockResolvedValue([
      { status: 'Pendente' },
      { status: 'Rejeitada' },
    ]);
    const result = await service.execute(1, 'Diretor' as any);
    expect(result.pendingRequests).toHaveLength(1);
    expect(result.processedRequests).toHaveLength(1);
  });

  it('deve lançar ForbiddenException para tipo não autorizado', async () => {
    await expect(service.execute(1, 'Docente' as any)).rejects.toThrow(ForbiddenException);
  });
});
