import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChangeUserRoleService } from './change-user-role.service';

const mockTx = {
  unidade: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  pessoa: { update: jest.fn() },
};

const mockRepo = { findById: jest.fn() };
const mockPrisma = {
  $transaction: jest.fn().mockImplementation((fn: any) => fn(mockTx)),
};

describe('ChangeUserRoleService', () => {
  let service: ChangeUserRoleService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ChangeUserRoleService(mockRepo as any, mockPrisma as any);
    mockPrisma.$transaction.mockImplementation((fn: any) => fn(mockTx));
    mockTx.pessoa.update.mockResolvedValue({ pessoa_id: 1 });
  });

  it('deve lançar NotFoundException se usuário alvo não encontrado', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.execute('uuid-99', 'Diretor' as any)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ForbiddenException se usuário logado sem permissão', async () => {
    mockRepo.findById
      .mockResolvedValueOnce({ pessoa_id: 'uuid-1', tipo_usuario: 'Docente' })
      .mockResolvedValueOnce({ pessoa_id: 'uuid-2', tipo_usuario: 'Docente' });
    await expect(service.execute('uuid-1', 'Diretor' as any, undefined, 'uuid-2')).rejects.toThrow(ForbiddenException);
  });

  it('deve executar transação se usuário logado é Administrador', async () => {
    mockRepo.findById
      .mockResolvedValueOnce({ pessoa_id: 'uuid-1', tipo_usuario: 'Docente' })
      .mockResolvedValueOnce({ pessoa_id: 'uuid-2', tipo_usuario: 'Administrador' });
    mockTx.unidade.findUnique.mockResolvedValue({ unidade_id: 'uuid-10', diretor_id: null });
    await service.execute('uuid-1', 'Diretor' as any, 'uuid-10', 'uuid-2');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('deve remover vínculo diretor quando mudando de Diretor para outro tipo', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1', tipo_usuario: 'Diretor' });
    mockTx.unidade.findFirst.mockResolvedValue({ unidade_id: 'uuid-5' });
    mockTx.unidade.update.mockResolvedValue({});
    await service.execute('uuid-1', 'Docente' as any);
    expect(mockTx.unidade.update).toHaveBeenCalled();
  });

  it('deve lançar ForbiddenException se definindo Diretor sem unidadeId', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1', tipo_usuario: 'Docente' });
    await expect(service.execute('uuid-1', 'Diretor' as any)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar NotFoundException se unidade não encontrada ao definir Diretor', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1', tipo_usuario: 'Docente' });
    mockTx.unidade.findUnique.mockResolvedValue(null);
    await expect(service.execute('uuid-1', 'Diretor' as any, 'uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se unidade já tem diretor diferente', async () => {
    mockRepo.findById.mockResolvedValue({ pessoa_id: 'uuid-1', tipo_usuario: 'Docente' });
    mockTx.unidade.findUnique.mockResolvedValue({ unidade_id: 'uuid-10', diretor_id: 'uuid-99', diretor: { nome: 'Outro' } });
    await expect(service.execute('uuid-1', 'Diretor' as any, 'uuid-10')).rejects.toThrow(ConflictException);
  });
});
