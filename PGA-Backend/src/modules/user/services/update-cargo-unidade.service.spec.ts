import { NotFoundException } from '@nestjs/common';
import { UpdateCargoUnidadeService } from './update-cargo-unidade.service';

const mockPrisma = {
  pessoaUnidade: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('UpdateCargoUnidadeService', () => {
  let service: UpdateCargoUnidadeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateCargoUnidadeService(mockPrisma as any);
  });

  it('deve lançar NotFoundException se vínculo não existe', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue(null);
    await expect(
      service.execute('pessoa-1', 'unidade-1', 'Coordenador' as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar cargo quando vínculo existe', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue({ pessoa_id: 'pessoa-1', unidade_id: 'unidade-1' });
    mockPrisma.pessoaUnidade.update.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: 'Coordenador',
    });
    const result = await service.execute('pessoa-1', 'unidade-1', 'Coordenador' as any);
    expect(mockPrisma.pessoaUnidade.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { cargo: 'Coordenador' } }),
    );
    expect(result.cargo).toBe('Coordenador');
  });

  it('deve aceitar cargo null e limpar o campo', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue({ pessoa_id: 'pessoa-1', unidade_id: 'unidade-1' });
    mockPrisma.pessoaUnidade.update.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: null,
    });
    const result = await service.execute('pessoa-1', 'unidade-1', null);
    expect(mockPrisma.pessoaUnidade.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { cargo: null } }),
    );
    expect(result.cargo).toBeNull();
  });
});
