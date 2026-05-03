import { ConflictException, NotFoundException } from '@nestjs/common';
import { RequestAccessService } from './request-access.service';

const mockPrisma = {
  unidade: { findFirst: jest.fn() },
  solicitacaoAcesso: { findFirst: jest.fn(), create: jest.fn() },
};

describe('RequestAccessService', () => {
  let service: RequestAccessService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RequestAccessService(mockPrisma as any);
  });

  it('deve lançar NotFoundException se unidade não encontrada', async () => {
    mockPrisma.unidade.findFirst.mockResolvedValue(null);
    await expect(
      service.execute({
        codigo_unidade: 'X',
        email: 'a@b.com',
        nome: 'A',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se já existe solicitação pendente', async () => {
    mockPrisma.unidade.findFirst.mockResolvedValue({ unidade_id: 1 });
    mockPrisma.solicitacaoAcesso.findFirst.mockResolvedValue({
      solicitacao_id: 1,
    });
    await expect(
      service.execute({
        codigo_unidade: 'X',
        email: 'a@b.com',
        nome: 'A',
      } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('deve criar solicitação com sucesso', async () => {
    mockPrisma.unidade.findFirst.mockResolvedValue({ unidade_id: 1 });
    mockPrisma.solicitacaoAcesso.findFirst.mockResolvedValue(null);
    mockPrisma.solicitacaoAcesso.create.mockResolvedValue({
      solicitacao_id: 1,
      nome: 'A',
    });
    const result = await service.execute({
      codigo_unidade: 'X',
      email: 'a@b.com',
      nome: 'A',
    } as any);
    expect(mockPrisma.solicitacaoAcesso.create).toHaveBeenCalled();
  });
});
