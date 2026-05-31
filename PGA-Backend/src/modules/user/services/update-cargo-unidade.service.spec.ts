import { NotFoundException } from '@nestjs/common';
import { UpdateCargoUnidadeService } from './update-cargo-unidade.service';

describe('UpdateCargoUnidadeService', () => {
  let service: UpdateCargoUnidadeService;

  const mockPrisma = {
    pessoaUnidade: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateCargoUnidadeService(mockPrisma as any);
  });

  it('deve lançar NotFoundException se vínculo pessoa-unidade não existe', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue(null);

    await expect(
      service.execute('pessoa-1', 'unidade-1', 'Coordenador' as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar cargo quando vínculo existe', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: null,
    });
    mockPrisma.pessoaUnidade.update.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: 'Coordenador',
    });

    const result = await service.execute(
      'pessoa-1',
      'unidade-1',
      'Coordenador' as any,
    );

    expect(result.cargo).toBe('Coordenador');
    expect(mockPrisma.pessoaUnidade.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { cargo: 'Coordenador' },
      }),
    );
  });

  it('deve atualizar cargo para null', async () => {
    mockPrisma.pessoaUnidade.findUnique.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: 'Coordenador',
    });
    mockPrisma.pessoaUnidade.update.mockResolvedValue({
      pessoa_id: 'pessoa-1',
      unidade_id: 'unidade-1',
      cargo: null,
    });

    const result = await service.execute('pessoa-1', 'unidade-1', null);

    expect(result.cargo).toBeNull();
    expect(mockPrisma.pessoaUnidade.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { cargo: null },
      }),
    );
  });
});
