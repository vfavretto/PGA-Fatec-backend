import { NotFoundException } from '@nestjs/common';
import { GetUserService } from './get-user.service';

const mockRepo = { findById: jest.fn() };

describe('GetUserService', () => {
  let service: GetUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GetUserService(mockRepo as any);
  });

  it('deve retornar usuário existente', async () => {
    const user = { pessoa_id: 1, nome: 'Test' };
    mockRepo.findById.mockResolvedValue(user);

    const result = await service.execute(1);
    expect(result).toBe(user);
  });

  it('deve lançar NotFoundException se usuário não encontrado', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});
