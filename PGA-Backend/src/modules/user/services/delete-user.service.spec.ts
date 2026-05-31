import { NotFoundException, ConflictException } from '@nestjs/common';
import { DeleteUserService } from './delete-user.service';

const mockRepo = { findById: jest.fn() };
const mockTx = {
  pessoaUnidade: { updateMany: jest.fn() },
  pessoa: { update: jest.fn() },
};
const mockPrisma = {
  projetoPessoa: { count: jest.fn() },
  curso: { count: jest.fn() },
  $transaction: jest.fn().mockImplementation((fn: any) => fn(mockTx)),
};
const mockAuditRepo = { createAuditLog: jest.fn() };

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteUserService(
      mockRepo as any,
      mockPrisma as any,
      mockAuditRepo as any,
    );
    mockPrisma.$transaction.mockImplementation((fn: any) => fn(mockTx));
    mockTx.pessoaUnidade.updateMany.mockResolvedValue({});
    mockAuditRepo.createAuditLog.mockResolvedValue({});
    mockTx.pessoa.update.mockResolvedValue({ pessoa_id: 'uuid-1', ativo: false });
  });

  it('deve lançar NotFoundException se usuário não encontrado', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se usuário vinculado a projetos ativos', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1' });
    mockPrisma.projetoPessoa.count.mockResolvedValue(2);

    await expect(service.execute('uuid-1')).rejects.toThrow(ConflictException);
  });

  it('deve lançar ConflictException se usuário é coordenador de cursos ativos', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1' });
    mockPrisma.projetoPessoa.count.mockResolvedValue(0);
    mockPrisma.curso.count.mockResolvedValue(1);

    await expect(service.execute('uuid-1')).rejects.toThrow(ConflictException);
  });

  it('deve executar a transação de exclusão quando sem conflitos', async () => {
    const user = { pessoa_id: 'uuid-1', nome: 'Test' };
    mockRepo.findById.mockResolvedValue(user);
    mockPrisma.projetoPessoa.count.mockResolvedValue(0);
    mockPrisma.curso.count.mockResolvedValue(0);

    const result = await service.execute('uuid-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(mockTx.pessoaUnidade.updateMany).toHaveBeenCalled();
    expect(mockTx.pessoa.update).toHaveBeenCalled();
    expect(mockAuditRepo.createAuditLog).toHaveBeenCalled();
    expect((result as any).ativo).toBe(false);
  });
});
